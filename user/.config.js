const path = require("path");
module.exports = {
  user: {
    DBURL: process.env.DBURL || "192.168.99.100",
    DBNAME: process.env.DBNAME || "bibat_user"
  },
  mailer: {
    host: "example host",
    port: 00,
    auth: {
      user: "example user",
      pass: "example pass"
    }
  },
  JWTSECRET: process.env.JWTSECRET || "example"
};
