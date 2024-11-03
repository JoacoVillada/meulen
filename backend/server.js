const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const salt = 10;

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "PUT"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

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

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: "You are not authenticated" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ Error: "Token no correct" });
      } else {
        req.name = decoded.name;
        next();
      }
    });
  }
};

app.get("/", verifyUser, (req, res) => {
  return res.json("Success");
});

app.post("/signup", (req, res) => {
  const sql = "INSERT INTO usuarios (`nombre`, `email`, `password`) VALUES (?)";
  bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    if (err) return res.json({ Error: "Error for hassing password" });
    const values = [req.body.name, req.body.email, hash];
    console.log("ayuda", values);
    db.query(sql, [values], (err, data) => {
      if (err) {
        return res.json("Error");
      }
      return res.json(data);
    });
  });
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM usuarios WHERE `email` = ?";

  db.query(sql, [req.body.email], (err, data) => {
    if (err) return res.json({ Error: "Login error in server" });
    if (data.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        data[0].password,
        (err, response) => {
          if (response) {
            const name = data[0].name;
            const userId = data[0].id; // Obtener el ID del usuario
            const token = jwt.sign({ name, userId }, "jwt-secret-key", {
              // Incluir userId en el token
              expiresIn: "1d",
            });
            res.cookie("token", token);
            return res.json({ message: "Success", userId }); // Pasar el userId en la respuesta
          } else {
            return res.json({ message: "Failed" });
          }
        }
      );
    } else {
      return res.json({ message: "User not found" });
    }
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.clearCookie("userId");
  return res.json("nashe");
});

// COSAS DEL USUARIO ---------------------

// Ruta para obtener los datos de la tabla productos
app.get("/productos", (req, res) => {
  const sql = "SELECT * FROM productos";

  db.query(sql, (err, data) => {
    if (err) {
      return res.json({ Error: "Error al obtener los productos" });
    }
    return res.json(data);
  });
});
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// -- Confirmar Pedido

app.post("/crearPedido", (req, res) => {
  const { lista_productos, id_cliente, precio_total } = req.body;

  const sql =
    "INSERT INTO pedidos (`lista_productos`, `id_cliente`, `precio_total`) VALUES (?, ?, ?)";

  db.query(
    sql,
    [JSON.stringify(lista_productos), id_cliente, precio_total],
    (err, result) => {
      if (err) {
        return res.json({ Error: "Error al crear el pedido" });
      }
      return res.json({ Success: "Pedido creado exitosamente", data: result });
    }
  );
});

// VER PEDIDOSSS

// backend/index.js o rutas/pedidos.js
app.get("/verPedidos/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql = "SELECT * FROM pedidos WHERE id_cliente = ?";

  db.query(sql, [userId], (err, data) => {
    if (err) {
      return res.status(500).json({ Error: "Error al obtener los pedidos" });
    }
    res.json(data);
  });
});

app.get("/editarUsuario/:id", (req, res) => {
  const sql = "SELECT * FROM usuarios where id = ?";
  const id = req.params.id;
  db.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: err });
    return res.json({ result });
  });
});

app.put("/update/:id", (req, res) => {
  const sql = "UPDATE usuarios SET `nombre` = ?, `email` = ? WHERE id = ?";
  const id = req.params.id;
  db.query(sql, [req.body.name, req.body.email, id], (err, result) => {
    if (err) return res.json("ERROR");
    return res.json({ updated: true });
  });
});

// RECUPERAR CONTRASEÑA ------------------
