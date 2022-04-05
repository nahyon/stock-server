const router = require("express").Router();
const db = require("../app.js");
const axios = require("axios");
var path = require('path');//이미지 테스트한다고 추가함
const API_KEY = process.env.ALPHAVANTAGEAPI;


//모든 회사 
router.get("/all", function (req, res) {
  const sql = `SELECT symbol, name, kr_name FROM company_info`;
  db.query(sql, function (err, rows, fields) {
    res.json(rows);
  });
});


//특정 symbol만
router.get("/:symbol", function (req, res) {
  const symbol = req.params.symbol;
  const sql = `SELECT symbol, name, kr_name, img FROM company_info where symbol = ?`;
  db.query(sql, symbol, function (err, rows, fields) {
    console.log(rows);
    res.json(JSON.parse(JSON.stringify(rows))[0]); //ROWS

  });
});

module.exports = router;
