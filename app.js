const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("./models/db"); // Impor file db.js
const user = require("./models/user"); // Impor model MongoDB
const expressSession = require("express-session");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
// ambil socket io
const mqtt = require("mqtt");
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  }
});

// ambil mqtt
const client = mqtt.connect("mqtt://127.0.0.1:1883");

client.on("connect", () => {
  console.log("mqttne konek REK");
  client.subscribe("Jemuran/Cahaya");
  client.subscribe("Jemuran/Hujan");
  client.subscribe("Jemuran/Posisi");
});

// Middleware untuk menyajikan file statis dari folder 'public'
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "10000mb",
    parameterLimit: 100000,
  })
);
app.use(
  expressSession({
    key: "user_sid",
    secret: "IOT_Jemuran",
    resave: true,
    saveUninitialized: true,
    cookie: { expires: 86400000 },
  })
);

app.set("view engine", "ejs");
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

// Menyajikan halaman index.html
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/register", async (req, res) => {
  const users = new user({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  await users.save();
  res.redirect("/login");
});

app.post("/login", async (req, res) => {
  const data = await user.findOne({ name: req.body.name });
  console.log(data)
  if (!data) {
    console.log("Tidak ada user")
    res.redirect("/login");
  } else {
    if (data.password === req.body.password) {
      req.session.user = data;
      console.log(req.session.user)
      res.redirect("/dashboard");
    } else {
      console.log("Password salah")
      res.redirect("/login");
    }
  }
});

app.get("/dashboard", async (req, res) => {
  isLogin = req.session.user ? true : false;
  console.log(isLogin)
  if (isLogin) {
    res.render("dashboard");
  } else {
    res.redirect("/login");
  }
});

// buat koneksi
io.on("connection", (socket) => {
  console.log("ono wong konek njirr");

  client.on("message", (topic, message) => {
    if (topic.toString() === "Jemuran/Cahaya") {
      socket.emit("Cahaya", message.toString());
    } else if (topic.toString() === "Jemuran/Hujan") {
      socket.emit("Hujan", message.toString());
    } else if (topic.toString() === "Jemuran/Posisi") {
      socket.emit("Posisi", message.toString());
    }
  });

  socket.on("p", (data) => {
    // console.log(data.toString());
    client.publish("Jemuran", data.toString());
  });

  socket.on("disconnect", () => {
    console.log("user disconnected")
  });
});





http.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
