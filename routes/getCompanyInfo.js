const router = require("express").Router();
const db = require("../app.js");
//const crawling = require("./crawling");
const axios = require("axios");
//const delayFunc = require("./delayFunc");
const API_KEY = process.env.ALPHAVANTAGEAPI;

const symbols = ['AAPL', 'MSFT', 'GOOG', 'GOOGL', 'AMZN']// 'TSLA', 'FB', 'NVDA', 'TSM', 'JPM']//, 'V', 'JNJ', 'UNH', 'HD', 'WMT', 'BAC', 'PG', 'BABA'];

async function callAPI(symbol) {
	try {
    const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}` ;
		const response = await axios.get(url);   
    //console.log(response.data);
    const res = response.data;

    let count = 5;
    const description = res["Description"];
    const marketCap = res["MarketCapitalization"];
    const name = res["Name"];
    //console.log(description, marketCap, name);

    if (marketCap) {
      const sql = `insert IGNORE into company_info(symbol, name, description, cap) values (?)`;
      count -= 1;
      console.log(
        symbol + " inserted into database : " + count + " symbols left"
      );

      const array = [symbol, name, description, marketCap];
      db.query(sql, [array], function (err, rows, fields) {});
    }
    
	} catch (error) {
		console.log(error);
	}
}
function delay() {
	return new Promise(resolve => setTimeout(resolve, 12050));//12050)); //12초이상 (5call/분)
}
async function delayedLog(symbol) {
	await delay();
	await callAPI(symbol);
	//console.log(symbol);
}
async function processArray(symbols) {
	for (const symbol of symbols) {
		await delayedLog(symbol);
	}
	console.log('Done!');
}


//---------------------------------------------[POST]----------------------------
router.post("/", function (req, res) {
  processArray(symbols);
})


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
