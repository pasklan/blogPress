const Sequelize = require("sequelize");

const connection = new Sequelize("guidepress", "root", "q1w2e3r4", {
  host: "localhost",
  dialect: "mysql",
  timezone: "-03:00",
});

module.exports = connection;
