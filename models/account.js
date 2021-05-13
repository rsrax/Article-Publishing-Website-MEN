var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");
const crypto = require("crypto");

var Account = new Schema({
  username: String,
  password: String,
  fullname: String,
  email: String,
  contact: String,
  dob: Date,
  profilePic: String,
  isEditor: Boolean,
  isAdmin: Boolean,
  isAuthor: Boolean,
  psalt: String,
});

Account.plugin(passportLocalMongoose);

Account.pre("save", function (next) {
  var user = this;
  if (!user.isModified("password")) return next();
  var rand = Math.floor(Math.random() * 1000000000).toString(36);
  var hash = crypto
    .createHash("md5")
    .update(user.password + rand)
    .digest("hex");
  user.password = hash;
  user.psalt = rand;
  next();
});

Account.methods.validPassword = function (password) {
  var testhash = crypto
    .createHash("md5")
    .update(password + this.psalt)
    .digest("hex");
  console.log(testhash);
  if (testhash === this.password) {
    return true;
  }
  return false;
};

module.exports = mongoose.model("Account", Account);
