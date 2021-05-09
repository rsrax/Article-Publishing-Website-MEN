var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/profile", function (req, res, next) {
  res.render("users/profile", { user: req.cookies.userData });
});

router.get("/newsfeed", function (req, res, next) {
  res.render("users/newsfeed", {
    articles: articles,
    user: req.cookies.userData,
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

module.exports = router;
