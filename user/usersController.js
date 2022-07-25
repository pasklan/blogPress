const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");

router.get("/admin/users", (req, res) => {
  User.findAll().then(users => {
    res.render("admin/users/index", { users: users });
  });
});

router.get("/admin/users/create", (req, res) => {
  res.render("admin/users/create");
});

router.get("/login", (req, res) => {
  res.render("admin/users/login");
});

router.post("/authenticate", (req, res) => {
  const login = req.body.login;
  const password = req.body.password;
  User.findOne({ where: { login: login } }).then(user => {
    if (user != undefined) {
      const correctPassword = bcrypt.compareSync(password, user.password);
      if (correctPassword) {
        req.session.user = {
          id: user.id,
          login: user.login,
        };
        res.redirect("/admin/articles");
      } else {
        res.redirect("/login");
      }
    } else {
      res.redirect("/login");
    }
  });
});

router.post("/users/create", (req, res) => {
  let login = req.body.login;
  let password = req.body.password;

  User.findOne({ where: { login: login } }).then(user => {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    if (user === null) {
      User.create({
        login: login,
        password: hash,
      })
        .then(() => {
          res.redirect("/");
        })
        .catch(err => {
          res.redirect("/");
        });
    } else {
      res.redirect("/admin/users/create");
    }
  });
});

router.get("/logout", (req, res) => {
  req.session.user = undefined;
  res.redirect("/");
});

module.exports = router;
