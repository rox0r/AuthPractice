//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

// Routes ------------------------------------------------
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const email = req.body.username;
  const password = md5(req.body.password);
  User.findOne({ email: req.body.username }, (err, foundUser) => {
    if (err) {
      console.log(err);
      res.redirect("/login");
    } else if (foundUser) {
      if (foundUser.password === password) {
        res.render("secrets");
      } else {
        console.log("Wrong Password");
        res.redirect("/login");
      }
    } else {
      console.log("User does not exist");
      res.redirect("/register");
    }
  });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password),
  });
  newUser.save((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Registration Successful");
      res.render("secrets");
    }
  });
});

app.listen(3000, () => {
  console.log("Started listening at port 3000");
});
