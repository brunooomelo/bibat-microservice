const check = (req, res) => {
  return res.status(200).json({message: 'server healthly', status: true});
};

module.exports = {
  check,
};
