const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('./models/db'); // Impor file db.js
const user = require('./models/user'); // Impor model MongoDB
const expressSession = require('express-session');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;

// Middleware untuk menyajikan file statis dari folder 'public'
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit : "10000mb", parameterLimit : 100000 }));
app.use(expressSession({key : "user_sid", secret : "IOT_Jemuran", resave: true, saveUninitialized: true, cookie: { secure: true }}))

app.set("view engine",'ejs');
app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/register', (req,res) => {
  res.render('register')
})

// Menyajikan halaman index.html
app.get('/', (req, res) => {
  res.render('index')
});

app.post("/register", async (req,res) => {
  const users = new user({
    name : req.body.username,
    email : req.body.email,
    password : req.body.password
  })
  await users.save();
  res.redirect("/login")
})

app.post("/login", async (req, res) => {
  const data = await user.findOne({ email : req.body.email });
  if (!data){
    res.redirect("/login");
  } else {
    if (data.password === req.body.password){
      res.redirect("/");
    }
  }
})

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
