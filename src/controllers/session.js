const logIn = async (req, res) => {
  if (!req.body['grant_type']) {
    return res.status(406).json({error: 'grant_type is missing'});
  }

  if (!['refresh_token', 'signin'].includes(req.body['grant_type'])) {
    return res.status(406).json({error: 'grant_type: method invalid'});
  }

  if (req.body['grant_type'] === 'refresh_token') {
    if (!req.headers.authorization) {
      return res.status(406).json({error: 'token is missing'});
    }
    const token = req.headers.authorization.split(' ');
    jwt.verify(
      token[1],
      JWTSECRET,
      {ignoreExpiration: true},
      function (err, decoded) {
        if (err) {
          return res.status(406).json({error: 'token is invalid'});
        }
        return res.status(201).json({
          token: jwt.sign(
            {username: decoded.username, email: decoded.email},
            JWTSECRET,
            {expiresIn: '3m'}
          ),
        });
      }
    );
  }

  if (req.body['grant_type'] === 'signin') {
    try {
      if (!req.body['username'] && !req.body['login']) {
        return res.status(406).json({error: 'username is missing'});
      }
      if (!req.body['password']) {
        return res.status(406).json({error: 'password is missing'});
      }

      const password = req.body.password;
      const login = req.body.login || req.body.username;

      const user = await User.findOne({
        $or: [
          {
            username: login,
          },
          {
            email: login,
          },
        ],
      }).select('+password');

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({error: 'usuario ou senha esta incorreto'});
      }
      if (!user.isActive) {
        return res.status(400).json({error: 'usuario não esta ativo'});
      }
      user.password = undefined;
      return res.status(201).json({
        token: jwt.sign({user}, JWTSECRET),
      });
    } catch (error) {
      res.json(error);
    }
  }
};

const forgotPassword = async (req, res) => {
  try {
    if (!req.body['email']) {
      return res.status(406).json({error: 'email is missing'});
    }
    const {email} = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({error: 'usuario ou email não encontrado'});
    }

    const token = crypto.randomBytes(20).toString('hex');

    const now = new Date();
    now.setHours(now.getHours() + 1);

    await User.findByIdAndUpdate(user.id, {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: now,
      },
    });

    await mailer.sendMail(
      {
        to: email,
        from: 'utibmelo@gmail.com',
        template: 'template/forgot_password',
        context: {token},
      },
      (err) => {
        if (err) {
          return res.status(400).json({
            error: 'cannot send forgot password email',
          });
        }
        return res.json();
      }
    );
  } catch (error) {
    return res.status(400).send({error: 'Error on forgot password, try agian'});
  }
};

const resetPassword = async (req, res) => {
  try {
    const {email, token, password} = req.body;
    const user = await User.findOne({
      email,
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      return res.status(400).json({error: 'User not found'});
    }
    if (token !== user.passwordResetToken) {
      return res.status(400).json({error: 'Token invalid'});
    }

    const now = new Date();

    if (now > user.passwordResetExpires) {
      return res.status(400).json({error: 'Token expirou, gera um novo'});
    }
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    res.send({message: 'Senha alterada com sucesso'});
  } catch (e) {
    res.status(400).json({error: 'cannot reset password, try agian'});
  }
};

module.exports = {logIn, forgotPassword, resetPassword};
