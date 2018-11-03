const axios = require("axios");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }
    if (authHeader.split(" ").length !== 2) {
      return res.status(401).json({ error: "Token error" });
    }
    if (!/^Bearer$/i.test(authHeader.split(" ")[0])) {
      return res.status(401).json({ error: "Token malformatted" });
    }
    axios.defaults.headers.common["Authorization"] = req.headers.authorization;
    let auth = await axios.post("http://localhost:3000/release");
    req.owner = auth.data.user;
    next();
  } catch (error) {
    return res.status(301).json({ error: "Token invalid" });
  }
};
