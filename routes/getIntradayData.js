const router = require("express").Router();
const db = require("../app.js");
const API_KEY = process.env.ALPHAVANTAGEAPI;


//---------------------------------------------[GET] 1 symbol----------------------------
router.get("/:symbol", function (req, res) {
  const symbol = req.params.symbol;
  const sql = `SELECT * from intraday where symbol= ?`;
  db.query(sql, symbol, function (err, rows, fields) {
    res.json(rows);
  });
});

module.exports = router;
