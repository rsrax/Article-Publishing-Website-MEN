var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var bodyParser = require("body-parser");
const Article = require("./models/article");
const articleRouter = require("./routes/articles");
const methodOverride = require("method-override");
const favicon = require("serve-favicon");
const flash = require("connect-flash");
const account = require("./models/account");

var app = express();

var routes = require("./routes/index");
var users = require("./routes/users");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("views/users", path.join(__dirname, "views/users"));
app.set("views/articles", path.join(__dirname, "views/articles"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "public/javascripts",
  express.static(path.join(__dirname, "public/javascripts"))
);
app.use(
  "public/javascripts",
  express.static(path.join(__dirname, "public/javascripts/navbar"))
);
app.use(
  "public/stylesheets",
  express.static(path.join(__dirname, "public/stylesheets"))
);
app.use(
  "public/font-awesome-4.3.0",
  express.static(path.join(__dirname, "public/font-awesome-4.3.0"))
);
app.use("public/fonts", express.static(path.join(__dirname, "public/fonts")));
app.use("public/images", express.static(path.join(__dirname, "public/images")));
app.use(favicon(path.join(__dirname, "public/images", "favicon.ico")));

app.use(flash());

app.set("view engine", "pug");

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  require("cookie-session")({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    maxAge: 60 * 60 * 1000,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));

app.use(methodOverride("_method"));

var Account = require("./models/account");
passport.use(
  "local-login",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    function (req, username, password, done) {
      Account.findOne({ username: username }, function (err, user) {
        if (err) {
          console.log(err);
          return done(err);
        }
        if (!user) {
          return done(null, false, req.flash("error", "User not found"));
        }
        if (!user.validPassword(password)) {
          console.log("incorrect password");
          return done(null, false, req.flash("error", "Password incorrect"));
        }
        return done(null, user);
      });
    }
  )
);

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    function (req, username, password, done) {
      process.nextTick(function () {
        Account.findOne({ username: username }, function (err, user) {
          if (err) return done(err);

          if (user) {
            return done(
              null,
              false,
              req.flash("error", "That username is already taken.")
            );
          } else if (password != req.body.C_password) {
            return done(
              null,
              false,
              req.flash("error", "The passwords do not match")
            );
          } else if (Account.findOne({ email: req.body.email })) {
            return done(
              null,
              false,
              req.flash("error", "The email is already registered")
            );
          } else {
            console.log(username + " " + password);
            var newUser = new account({
              username: username,
              password: password,
              fullname: req.body.name,
              email: req.body.email,
              contact: req.body.ContactNo,
              dob: req.body.DOB,
              profilePic: "",
              isEditor: 0,
              isAdmin: 0,
              isAuthor: 0,
            });

            newUser.save(function (err) {
              if (err) throw err;
              return done(null, newUser);
            });
          }
        });
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  Account.findById(id, function (err, user) {
    done(err, user);
  });
});

//mongoose setup
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect(
  "mongodb+srv://RS:U.eBE-aST8hC6C4@cluster0.wydjm.mongodb.net/News_App?retryWrites=true&w=majority"
);

app.use("/", routes);
app.use("/users", users);
app.use("/articles", articleRouter);

app.get("/flash", (req, res) => {
  req.flash("message", 'This is a message from the "/flash" endpoint');
  res.redirect("/contact");
});

app.get("/contact", (req, res) => {
  res.send(req.flash("message"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  if (err.status == 404) res.render("404");
  res.render("error");
});

module.exports = app;
