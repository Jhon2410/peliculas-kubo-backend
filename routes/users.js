const express = require("express");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const mysql = require("../db/mysql");
const privateKey = fs.readFileSync("env/private.key");
const jwt = require("jsonwebtoken");
const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  const token = req.headers["token"];
  if (token) {
    jwt.verify(token,  "privateKey", (err, decoded) => {
      if (err) {
        return res.json({ mensaje: "Token inválida", estado: 0 });
      } else {
        
        return res.json({ mensaje: "Token valida", usuario : decoded ,estado: 1});
     
      }
    });
  } else {
    
    res.json({
      msg: "Token no proveída.",
      estado: 0,
    });
  }
});

/* POST users listing. */

router.post("/", function (req, res, next) {
  const { username, password, rol, randid } = req.body;
  if (username && password && rol && randid) {
    mysql.query(
      "select * from usuario where username=?",
      [username],
      (err, results, fields) => {
        if (err) throw err;

        if (results.length === 1) {
          if (bcrypt.compareSync(password, results[0].password)) {
            let token = jwt.sign(
              {
                id_usuario: results[0].id_usuario,
                rand_id: randid,
                rol : results[0].rol,
                username : results[0].username,
                iat: Math.floor(Date.now() / 1000) - 30,
              },
              "privateKey",
              { expiresIn: "7d" }
            );
            return res.json({ token: token, msg:"logueo exito redirigiendo a panel", estado: 1 });
          }
          return res.json({
            msg: "usuario o contraseña incorrecta",
            estado: 0,
          });
        }
        return res.json({ msg: "usuario o contraseña incorrecta", estado: 0 });
      }
    );
  } else {
    res.json({ msg: "datos no enviados" });
  }
});

/* register users POST */
router.post("/register", function (req, res, next) {
  const { username, password, rol, randid } = req.body;
  hashPassword = bcrypt.hashSync(password, 10);

  if (username && password && rol && randid) {
    try {
      mysql.query(
        "insert into usuario(username, password, rol) values(?,?,?) ",
        [username, hashPassword, rol],
        (err, results, fields) => {
          if (err) return res.json({ msg: "Error el usuario ya existe" });
          console.log(results);

          let token = jwt.sign(
            {
              id_usuario: results.insertId,
              rand_id: randid,
              rol : rol,
              username : username,
              iat: Math.floor(Date.now() / 1000) - 30,
            },
            "privateKey",
            { expiresIn: "7d" }
          );
          return res.json({
            msg: "usuario registrado con exito",
            token,
            estado: 1,
          });
        }
      );
    } catch (err) {
      return res.json({ msg: "Error el usuario ya existe" });
    }
  } else {
    res.json({ msg: "datos no enviados" });
  }
});

/* PUT users listing. */
router.put("/", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  const { id, id_usuario, role, estado } = req.body.data;
  console.log(req.body);

  if (id_usuario) {
    if (role) {
      Usuario.updateOne(
        { _id: id_usuario },
        { $set: { role } },
        { multi: true, new: true }
      )
        .then((d) => {
          return res.json({ respuesta: d });
        })
        .catch((e) => {
          return res.json({ respuesta: "error" });
        });
    } else {
      if (estado) {
        Usuario.updateOne(
          { _id: id_usuario },
          { $set: { estado } },
          { multi: true, new: true }
        )
          .then((d) => {
            return res.json({ respuesta: d });
          })
          .catch((e) => {
            return res.json({ respuesta: "error" });
          });
      } else {
        res.json({ respuesta: "no tiene permisos para ejecutar esta acción" });
      }
    }
  } else {
    res.json({ respuesta: "error al consumir la api" });
  }
});

/* DELETE users listing. */
router.delete("/", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  const { id } = req.body;
  Usuario.remove({ _id: id })
    .then((d) => {
      return res.json({ respuesta: d });
    })
    .catch((e) => {
      return res.json({ respuesta: "error" });
    });
});

/* export users routes. */
module.exports = router;
