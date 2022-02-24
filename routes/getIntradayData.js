const router = require("express").Router();
const db = require("../app.js");
const axios = require("axios");
const API_KEY = process.env.ALPHAVANTAGEAPI;

const symbols = ['AAPL', 'MSFT', 'GOOG', 'GOOGL', 'AMZN']// 'TSLA', 'FB', 'NVDA', 'TSM', 'JPM']//, 'V', 'JNJ', 'UNH', 'HD', 'WMT', 'BAC', 'PG', 'BABA'];

function delay() {
	return new Promise(resolve => setTimeout(resolve, 12050));//12050)); //12초이상 (5call/분)
}
let count = 5; 
//(TIME_SERIES_INTRADAY)-----------------------------------------------------------------------------------------------------------------
async function callAPI(symbol) {
	try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&outputsize=full&apikey=${API_KEY}` ;
		const response = await axios.get(url);   
    //console.log(response.data);
    const res = response.data;
    content = res["Time Series (5min)"]
    
    
    if (content) {
      const keys = Object.keys(content);
      // console.log(keys);

      const sql = `insert IGNORE into intraday(symbol, timestamp, open, high,low,close,volume) values (?)`;
      count -= 1;
      console.log(
        symbol + " inserted into database : " + count + " symbols left"
      );

      // extract and insert data from API into mysql DB
      keys.forEach(function (key, index) {
        const row = content[key];
        const date = keys[index];
        const open = parseFloat(row["1. open"]);
        const high = parseFloat(row["2. high"]);
        const low = parseFloat(row["3. low"]);
        const close = parseFloat(row["4. close"]);
        const volume = parseInt(row["5. volume"]);
        const array = [symbol, date, open, high, low, close, volume];
        db.query(sql, [array], function (err, rows, fields) {});
      });
    }
    
	} catch (error) {
		console.log(error);
	}
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

//---------------------------------------------[POST]all symbols----------------------------
router.post("/", function (req, res) {
  processArray(symbols);
})

//---------------------------------------------[GET] 1 symbol----------------------------

router.get("/:symbol", function (req, res) {
  const symbol = req.params.symbol;
  const sql = `SELECT * from intraday where symbol= ?`;
  db.query(sql, symbol, function (err, rows, fields) {
    res.json(rows);
  });
});

module.exports = router;
