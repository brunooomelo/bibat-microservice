const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({error: 'No token provided'});
  }
  if (authHeader.split(' ').length !== 2) {
    return res.status(401).json({error: 'Token error'});
  }
  const [prefix, token] = authHeader.split(' ');
  if (!/^Bearer$/i.test(prefix)) {
    return res.status(401).json({error: 'Token malformatted'});
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(301).json({error: 'Token invalid'});
    req.user = decoded;
    return next();
  });
};
