const router = require("express").Router();
const db = require("../app.js");
const axios = require("axios");
const API_KEY = process.env.ALPHAVANTAGEAPI;


//모든 회사 
router.get("/all", function (req, res) {
  const sql = `SELECT symbol, name, kr_name FROM company_info`;
  db.query(sql, function (err, rows, fields) {
    res.json(rows);
  });
});


router.get("/:symbol", function (req, res) {
  const symbol = req.params.symbol;
  const sql = `SELECT img from company_info where symbol = ?`;
  db.query(sql, symbol, function (err, rows, fields) {
    //res.json(rows);
    res.type('png') ;
    console.log(Buffer.from({rows}, "utf8").toString('base64'))
    res.send(rows)
  });
});

module.exports = router;
