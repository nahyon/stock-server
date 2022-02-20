const router = require("express").Router();
const db = require("../app.js");
const crawling = require("./crawling");
const axios = require("axios");
const delayFunc = require("./delayFuncs");
const API_KEY = process.env.ALPHAVANTAGEAPI;

router.post("/", function (req, res) {
  // cron.schedule("0 * * * *", symbolCreator)
  async function getSymbol() {
    let symbol;
    let count = 100;
    const data = await crawling.crawlSymbol();
    // data2 = fs.readFileSync("./symbol.json")
    // parsedData = JSON.stringify(parsedData)
    for (var key in data) {
      //console.log(data);
      url = new Array();
      //   console.log(data[key].title);
      symbol = data[key].symbol;
      url[
        key
      ] = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`;
      //   console.log(url[key]);
      await delayFunc.sleep(12050).then(() =>
        axios({
          method: "get",
          url: url[key],
        })
          .then((res) => {
            //   console.log(res.data);
            let res2 = res.data;
            const description = res2["Description"];
            const marketCap = res2["MarketCapitalization"];
            const name = res2["Name"];
            if (marketCap) {
              const sql = `insert IGNORE into company_info(symbol, name, description, cap) values (?)`;
              count -= 1;
              console.log(
                symbol + " inserted into database : " + count + " symbols left"
              );

              const array = [symbol, name, description, marketCap];
              db.query(sql, [array], function (err, rows, fields) {});
            }
          })
          .catch(() => {
            console.log("rejected");
          })
      );
    }
  }
  getSymbol().then(() => {
    console.log("-----all the pieces of data are inserted!-----");
  });
});

//모든 회사 
router.get("/all", function (req, res) {
  const sql = `SELECT symbol, name, kr_name FROM company_info`;
  db.query(sql, function (err, rows, fields) {
    res.json(rows);
  });
});


router.get("/:symbol", function (req, res) {
  const symbol = req.params.symbol;
  const sql = `SELECT * from company_info where symbol = ?`;
  db.query(sql, symbol, function (err, rows, fields) {
    res.json(rows);
  });
});

module.exports = router;
