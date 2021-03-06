const express = require("express");

const app = express();

app.use(express.json());

// Query params = ?teste=1
// Route params = /teste/1
// Request body = payloads: { "name" : "caio" }

// Crude = Create, Read, Update, Delete

const users = ["Caio", "Lukas", "Hygor"];

app.use((req, res, next) => {
  console.time("Request");

  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd("Request");
});

var checkUserExists = (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).json({ error: "User is required" });
  }

  return next();
};

var checkUserInArray = (req, res, next) => {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: "User does not exists" });
  }

  req.user = user;

  return next();
};

app.get("/users", (req, res) => {
  return res.send(users);
});

app.get("/users/:index", checkUserInArray, (req, res) => {
  return res.send(req.user);
});

app.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

app.put("/users/:index", checkUserInArray, checkUserExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

app.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

app.listen(3000, () => console.log("Listed on port 3000"));
