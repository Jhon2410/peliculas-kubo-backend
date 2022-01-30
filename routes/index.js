const express = require("express");
const router = express.Router();
const mysql = require('../db/mysql');
const fs = require("fs");
const privateKey = fs.readFileSync("env/private.key");

/* GET home page. peliculas */
router.get("/", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");

  mysql.query('SELECT * from peliculas', function (error, results, fields) {
    if (error) throw error;
    if(results.length !== 0 ){
     return res.json({respuesta : "token valido", estado : 1, "peliculas":results})
    }else{
      return res.json({respuesta : "token valido", estado : 1, "peliculas":[]})
    }
  });
  
});



// router.put("/", function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   const {id} = req.body;
//   console.log(req.body)
//   Usuario.updateOne({_id:id},{$set:{name:"actualizado"}},{multi:true,new:true})
//  .then((data)=>{
//   return res.json({respuesta :data})
//   })
//  .catch((err)=>{
//    console.log(err);
//    return res.json({respuesta :"error "})
//  })
 
  
// });

// router.delete("/", function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   const {id} = req.body;
//   console.log(req.body)
//   Usuario.remove({_id:id})
//  .then((data)=>{
//   return res.json({respuesta :data})
//   })
//  .catch((err)=>{
//    console.log(err);
//    return res.json({respuesta :"error "})
//  })
 
  
// });





module.exports = router;
