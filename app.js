const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
require("dotenv").config();
app.set("view engine", "ejs");

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const postSchema = { title: String, content: String };
const Post = mongoose.model("Post", postSchema);

const homePage =
  "A blog can be defined as a ‘journal’ that the author publishes the the web or to a particular audience. Blogs are a great tool because they allow students to engage in a more authentic writing experience where they become the content expert and are writing to a targeted audience.";
const aboutPage =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";
const contactPage =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";

app.get("/", function (req, res) {
  Post.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully entered to DB!");
        res.render("home", {
          homePage: homePage,
          allPosts: foundItems,
        });
      }
    } else {
      res.render("home", {
        homePage: homePage,
        allPosts: foundItems,
      });
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutPage: aboutPage });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactPage: contactPage });
});

app.get("/publish", function (req, res) {
  res.render("publish");
});

app.get("/posts/:text", function (req, res) {
  const postId = req.params.text;

  Post.findOne({ _id: postId }, function (err, item) {
    if (err) {
      console.log(err);
    } else {
      res.render("post", { postTitle: item.title, postContent: item.content });
    }
  });
});

app.post("/publish", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.listen(process.env.port || 3000, function () {
  console.log("Server started at port 3000!");
});
