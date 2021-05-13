var express = require("express");
var passport = require("passport");
var Account = require("../models/account");
var articleRouter = require("./articles");
const Article = require("./../models/article");
const account = require("../models/account");
var router = express.Router();

router.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

router.use("/article", articleRouter);

router.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: "desc" });
  console.log(res.locals.user);
  res.render("articles/index", {
    articles: articles,
  });
});

router.get("/register", function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect("/");
  }
  res.render("register");
});

router.get("/check", function (req, res) {
  res.render("check");
});

router.post("/register", function (req, res, next) {
  passport.authenticate(
    "local-signup",
    {
      failureFlash: true,
    },
    function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect("/register");
      } else {
        passport.authenticate("local-login")(req, res, function () {
          res.redirect(`/users/profile/${user._id}`);
        });
      }
    }
  )(req, res, next);
});

router.get("/login", function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect("/");
  }
  res.render("login", { user: req.user });
});

router.post("/login", function (req, res, next) {
  passport.authenticate(
    "local-login",
    { failureFlash: true },
    function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect("/login");
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        return res.redirect(`/users/profile/${user._id}`);
      });
    }
  )(req, res, next);
});

router.get("/getuser", (req, res) => {
  //shows all the cookies
  res.send(req.cookies);
});

router.get("/logout", function (req, res) {
  res.cookie("userData", req.user, {
    expires: new Date(1),
  });
  req.logout();
  res.locals.user = null;
  res.redirect("/");
});

router.get("/ping", function (req, res) {
  res.status(200).send("pong!");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

module.exports = router;
