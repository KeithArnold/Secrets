//jshint esversion:6

                   require('dotenv').config();
const express    = require("express");              const app = express();   app.use(express.static("public"));
const bodyParser = require("body-parser");          app.use(bodyParser.urlencoded({extended: true}));
const ejs        = require("ejs");                  app.set('view engine', 'ejs');
const mongoose   = require('mongoose');             mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});
const encrypt    = require('mongoose-encryption');  //const Schema = mongoose.Schema;//

console.log(process.env.API_KEY);

// Mongoose schema for _______ //
const userSchema = new mongoose.Schema ( {
  email: String,
  password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password'] });  // Encryption package MUST be added before assigning model! //

// Mongoose model for _________//
const User = mongoose.model("User", userSchema);

app.get('/', function(req, res) {
  res.render("home");
});

app.get('/login', function(req, res) {
  res.render("login");
});

app.get('/register', function(req, res) {
  res.render("register");
});

app.post('/register', function(req, res) {
  const newUser = new User( {
    email:    req.body.username,
    password: req.body.password
  });
  newUser.save(function(err) {
    if (!err) {
        res.render("secrets");
    } else {
        console.log(err);
    }
  });
});

app.post('/login', function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email: username}, function(err, foundUser) {
    if (!err) {
        if (foundUser) {
          if (foundUser.password === password) {
            console.log("Match!");
            res.render("secrets");
          }
        } else {
        console.log("No match, error " + err);
      }
    }
 });
});

// Express LISTEN request for either dynamically assigned //
// port, or if not assigned will default to 3000.         //
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
};
app.listen(port, function() {
  console.log("Server started on port " +  port);
});
//                         ~ END ~                            //
