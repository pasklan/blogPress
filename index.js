const express = require("express");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const connection = require("./database/database");

const categoriesController = require("./categories/categoriesController");
const articlesController = require("./articles/articlesController");
const usersController = require("./user/usersController");
// Models
const Category = require("./categories/Category");
const Article = require("./articles/Article");
const User = require("./user/User");

// View Engine
app.set("view engine", "ejs");

// Sessions
app.set("trust proxy", 1);
app.use(
  session({
    secret: "senhasecreta",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60000,
    },
  })
);

// static
app.use(express.static("public"));

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Database
connection
  .authenticate()
  .then(() => {
    console.log("Success connection!");
  })
  .catch(error => {
    console.log(error);
  });

//Routes
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

app.get("/", (req, res) => {
  Article.findAll({
    order: [["id", "desc"]],
  }).then(articles => {
    Category.findAll().then(categories => {
      res.render("index", { articles: articles, categories: categories });
    });
  });
});

app.get("/:slug", (req, res) => {
  let slug = req.params.slug;
  Article.findOne({
    where: {
      slug: slug,
    },
  })
    .then(article => {
      if (article != undefined) {
        Category.findAll().then(categories => {
          res.render("article", { article: article, categories: categories });
        });
      } else {
        res.redirect("/");
      }
    })
    .catch(err => {
      res.redirect("/");
    });
});

app.get("/category/:slug", (req, res) => {
  let slug = req.params.slug;
  Category.findOne({
    where: {
      slug: slug,
    },
    include: [{ model: Article }],
  })
    .then(category => {
      if (category != undefined) {
        Category.findAll().then(categories => {
          res.render("index", {
            articles: category.articles,
            categories: categories,
          });
        });
      } else {
        res.redirect("/");
      }
    })
    .catch(err => {
      res.redirect("/");
    });
});

app.listen(2222, () => {
  console.log("Running server.");
});
