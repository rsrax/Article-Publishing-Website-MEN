var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/profile", function (req, res, next) {
  res.render("users/profile", { user: req.user });
});
const articles = [
  {
    title: "Test Article",
    createdAt: new Date(),
    description: "Test Description",
    photourl:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80",
  },
  {
    title: "Test Article1",
    createdAt: new Date(),
    description: "Test Description1",
    photourl:
      "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  },
  {
    title: "Test Article1",
    createdAt: new Date(),
    description: "Test Description1",
    photourl:
      "https://images.unsplash.com/photo-1556103255-4443dbae8e5a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGhvdG9ncmFwaGVyfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
  },
  {
    title: "Test Article1",
    createdAt: new Date(),
    description: "Test Description1",
    photourl:
      "https://st.depositphotos.com/1428083/2946/i/600/depositphotos_29460297-stock-photo-bird-cage.jpg",
  },
  {
    title: "Test Article1",
    createdAt: new Date(),
    description: "Test Description1",
    photourl:
      "https://st.depositphotos.com/1428083/2946/i/600/depositphotos_29460297-stock-photo-bird-cage.jpg",
  },
];
router.get("/newsfeed", function (req, res, next) {
  res.render("users/newsfeed", { articles: articles });
});

module.exports = router;
