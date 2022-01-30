const express = require("express");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const mysql = require("../db/mysql");
const privateKey = fs.readFileSync("env/private.key");
const jwt = require("jsonwebtoken");
const router = express.Router();

//get categorias
router.get("/categorias", (req, res, next) => {
  mysql.query("select * from categorias", (err, results, field) => {
    if (err) return console.log(err);
    res.json({ categorias: results });
  });
});

//get categorias - peliculas
router.get("/categorias/peliculas", (req, res, next) => {
  mysql.query("select * from categorias_peliculas", (err, results, field) => {
    if (err) return console.log(err);
    res.json({ categorias_peliculas: results });
  });
});
//calificar pelicula
router.post("/calificar", (req, res, next) => {
  const { calificacion, id_usuario, visto, id_pelicula } = req.body;

  if (calificacion && id_usuario && visto && id_pelicula) {
    mysql.query(
      "select calificacion, views from peliculas where id_pelicula = ?",
      [id_pelicula],
      (error, resultado, fields) => {
        if (error) return console.log(error);
        if (resultado[0].calificacion) {
         
          let promedio = resultado[0].calificacion;
          let views = resultado[0].views
          mysql.query(
            "update peliculas set calificacion=?, views=? where id_pelicula = ? ",
            [calificacion,views=views+1, id_pelicula],
            (e, r, f) => {
              if (e) return console.log(e);
              console.log(r);
              mysql.query(
                "select * from peliculas_usuario_historial where usuarioid_usuario=? AND peliculasid_pelicula=? ",
                [id_usuario, id_pelicula],
                (errorH, resultadoHistoria) => {
                  if (errorH) return console.log(errorH);
                  if (resultadoHistoria.length > 0) {
                    mysql.query(
                      "update  peliculas_usuario_historial set calififacion= ?  where usuarioid_usuario=? AND peliculasid_pelicula=?",
                      [calificacion, id_usuario, id_pelicula],
                      (errUpdateH, updateH) => {
                        if (errUpdateH) return console.log(errUpdateH);
                        console.log(updateH);
                        return res.json({ msg: "califiacado con exito" });
                      }
                    );
                  } else {
                    mysql.query(
                      "insert into peliculas_usuario_historial values(?,?,?,?)",
                      [id_pelicula, id_usuario, visto, calificacion],
                      (err, results, fields) => {
                        if (err) return console.log(err);
                        return res.json({ msg: "califiacado con exito" });
                      }
                    );
                  }
                }
              );
            }
          );
        }
      }
    );
    // mysql.query("insert into peliculas_usuario_historial values(?,?,?,?)",[id_pelicula,id_usuario,visto,calificacion],(err, results, fields)=>{
    //   if(err)  console.log(err)
    //   mysql.query("select * from peliculas where id_pelicula = ? ",[id_pelicula],(er, re, ff)=>{
    //       if(err) return  console.log(er);
    //       console.log(re)
    //       if(results) {
    //         mysql.query("update peliculas set calificacion=? where id_pelicula = ? ",[calificacion  ,  id_pelicula],(e,r,f)=>{
    //           if(e) return console.log(e)
    //           console.log(r)

    //       return  res.json({"msg":"califiacado con exito"})

    //         })
    //       }

    //   })

    // })
  } else {
    res.json({ msg: "datos no enviados correctamente", estado: 0 });
  }
});

// obtener calificaciones 


router.get("/historial",(req,res,next)=>{
  mysql.query("select * from peliculas_usuario_historial",(err,results)=>{
    if(err) return console.log(err)
    return res.json({history : results, estado : 1})
  })
})





//subir pelicula
router.post("/subir", function (req, res, next) {
  const { titulo, descripcion, trailer, fecha_estreno, duracion, categorias } =
    req.body;
  console.log(req.body);
  const caratula = req.file.filename;
  console.log(caratula);

  if (
    caratula &&
    titulo &&
    descripcion &&
    trailer &&
    fecha_estreno &&
    duracion
  ) {
    try {
      mysql.query(
        "insert into peliculas(caratula,titulo,Descripcion,trailer,fecha_estreno,views,calificacion,duracion) values(?,?,?,?,?,?,?,?);",
        [caratula, titulo, descripcion, trailer, fecha_estreno, 0, 0, duracion],
        (err, results, fields) => {
          if (err) return res.json({ msg: "Error" });
          console.log(results.insertId);
          categorias.split(",").map((c) => {
            mysql.query(
              "insert into categorias_peliculas values(?,?)",
              [c.substring(0, 2), results.insertId],
              (err, data, field) => {}
            );
          });
          return res.json({
            msg: "agregado registrado con exito",
            estado: 1,
          });
        }
      );
    } catch (err) {
      return res.json({ estado: 0, msg: "Error" + err });
    }
  } else {
    res.json({ estado: 0, msg: "datos no enviados" });
  }
});

module.exports = router;
