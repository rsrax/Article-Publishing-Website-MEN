var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");
let bcrypt = require("bcrypt");

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
  user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(12), null);
  next();
});

Account.methods.validPassword = function (password) {
  console.log("p " + password);
  console.log(this.password);
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("Account", Account);
