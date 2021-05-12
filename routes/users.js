var express = require("express");
const account = require("../models/account");
var router = express.Router();

router.use(function (req, res, next) {
  res.locals.user = req.user || "null";
  next();
});

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/profile/:id", async (req, res, next) => {
  const profile = await account.findById(req.params.id);
  res.render("users/profile", { user: profile });
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
