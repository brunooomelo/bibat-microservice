const index = async (req, res) => {
  const {page = 1, limit = 10} = req.query;
  const data = await User.paginate(
    {},
    {page: parseInt(page), limit: parseInt(limit)}
  );
  res.json(data);
};

const show = async (req, res) => {
  const {id} = req.params;
  const data = await User.findOne({_id: id});
  res.json({user: data});
};

const create = async (req, res) => {
  try {
    if (!req.body.email) {
      res.json({error: 'params email é requirido'});
      return false;
    }
    if (!req.body.username) {
      res.json({error: 'params username é requirido'});
      return false;
    }
    const {email, username} = req.body;

    const emailDuplicate = await User.findOne({email});
    const usernameDuplicate = await User.findOne({username});

    if (usernameDuplicate) {
      res.json({error: 'Usuario já existe'});
      return false;
    }
    if (emailDuplicate) {
      res.json({error: 'Email já existe'});
      return false;
    }

    await User.create(req.body);
    res.json({message: 'Usuario cadastrado com sucesso'});
  } catch (error) {
    res.json({error: error.message, type: error.name});
  }
  return false;
};

const activeUser = async (req, res) => {
  const {id} = req.params;
  const data = await User.updateOne({_id: id}, {isActive: true});
  res.json({data});
};

const update = async (req, res) => {
  const {id} = req.params;
  const data = await User.updateOne({_id: id}, req.body);
  res.json({data});
};

module.exports = {
  index,
  show,
  create,
  activeUser,
  update,
};
