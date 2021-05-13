var express = require("express");
const account = require("../models/account");
var router = express.Router();

router.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
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
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

module.exports = router;
