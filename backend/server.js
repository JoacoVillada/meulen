const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "meulen",
});

db.connect((error) => {
  if (error) throw error;
  console.log("Conectado a la base de datos");
});

app.post("/signup", (req, res) => {
  const sql = "INSERT INTO usuarios (`nombre`, `email`, `password`) VALUES (?)";
  const values = [req.body.name, req.body.email, req.body.password];
  console.log("ayuda", values);
  db.query(sql, [values], (err, data) => {
    if (err) {
      return res.json("Error");
    }
    return res.json(data);
  });
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM usuarios WHERE `email` = ? AND `password` = ?";
  const values = [req.body.email, req.body.password];
  console.log("ayuda", values);
  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    console.log("error: ", err);
    console.log("Data: ", data);
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json("Success");
    } else {
      return res.json("Failed");
    }
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
