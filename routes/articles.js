const express = require("express");
const Article = require("./../models/article");
const router = express.Router();

router.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: "desc" });
  res.render("articles/index", { articles: articles });
});

router.get("/new", isLoggedIn, (req, res) => {
  var user = req.cookies.userData;
  res.render("articles/new", {
    article: new Article(),
    user: user,
  });
});

router.get("/edit/:id", isLoggedIn, async (req, res) => {
  const article = await Article.findById(req.params.id);
  var user = req.cookies.userData;
  res.render("articles/edit", {
    article: article,
    user: user,
  });
});

router.get("/:slug", async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });
  if (article == null) res.redirect("/");
  res.render("articles/show", { article: article, user: req.cookies.userData });
});

router.post(
  "/",
  async (req, res, next) => {
    req.article = new Article();
    next();
  },
  saveArticleAndRedirect("new")
);

router.put(
  "/:id",
  async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
  },
  saveArticleAndRedirect("edit")
);

router.delete("/:id", async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;
    article.userid = req.body.id;
    try {
      article = await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch (e) {
      res.render(`articles/${path}`, { article: article });
    }
  };
}

function isLoggedIn(req, res, next) {
  if (req.cookies.userData) return next();
  res.redirect("/login");
}

module.exports = router;
