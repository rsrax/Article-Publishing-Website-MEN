var express = require("express");
var passport = require("passport");
var Account = require("../models/account");
var articleRouter = require("./articles");
const Article = require("./../models/article");
const account = require("../models/account");
var router = express.Router();

router.use(function (req, res, next) {
  res.locals.user = req.user || "null";
  next();
});

router.use("/article", articleRouter);

router.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: "desc" });
  res.render("articles/index", {
    articles: articles,
    user: req.cookies.userData,
  });
});

router.get("/register", function (req, res) {
  if (req.cookies.userData) {
    res.redirect("/");
  }
  res.render("register");
});

router.get("/check", function (req, res) {
  res.render("check");
});

router.post("/register", function (req, res) {
  Account.register(
    new Account({
      username: req.body.username,
      fullname: req.body.name,
      email: req.body.email,
      contact: req.body.ContactNo,
      dob: req.body.DOB,
      profilePic: "",
    }),
    req.body.password,
    function (err, account) {
      if (err) {
        return res.render("register", { account: account });
      }

      passport.authenticate("local")(req, res, function () {
        res.cookie("userData", req.user, { maxAge: 3600000 });
        res.redirect(`/users/profile/${req.user._id}`);
      });
    }
  );
});
router.get("/login", function (req, res) {
  if (req.cookies.userData) {
    res.redirect("/");
  }
  res.render("login", { user: req.user });
});

router.post("/login", passport.authenticate("local"), async (req, res) => {
  const user = await account.findOne({ username: req.body.username });
  if (user == null) res.redirect("/login");
  res.cookie("userData", req.user, { maxAge: 3600000 });
  res.redirect(`/users/profile/${user._id}`);
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
