const router = require("express").Router();
const db = require("../app.js");
const axios = require("axios");
const API_KEY = process.env.ALPHAVANTAGEAPI;


const symbols = ['AAPL', 'MSFT', 'GOOG', 'GOOGL', 'AMZN']// 'TSLA', 'FB', 'NVDA', 'TSM', 'JPM']//, 'V', 'JNJ', 'UNH', 'HD', 'WMT', 'BAC', 'PG', 'BABA'];

function delay() {
	return new Promise(resolve => setTimeout(resolve, 12050));//12050)); //12초이상 (5call/분)
}

//(TIME_SERIES_DAILY)-----------------------------------------------------------------------------------------------------------------
async function callAPI(symbol) {
	try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${API_KEY}` ;
		const response = await axios.get(url);   
    //console.log(response.data);
    const res = response.data;
    const content = res["Time Series (Daily)"];
    
    let count = 5; 
    if (content) {
      const keys = Object.keys(content);
      // console.log(keys)

      const sql = `insert IGNORE into daily(symbol, timestamp, open, high,low,close,volume) values (?)`;
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

//(GLOBAL_QUOTE)매일-----------------------------------------------------------------------------------------------------------------
async function callAPI2(symbol) {
	try {
    const url =  `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}` ;
		const response = await axios.get(url);   
    //console.log(response.data);
    const res = response.data;
    const content = res["Global Quote"];
    
    let count = 5; 
    const sy = content["01. symbol"];
    const open = content["02. open"];
    const high = content["03. high"];
    const low = content["04. low"];
    const close = content["08. previous close"];  //["05. price"]
    const volume = content["06. volume"];
    const ltd = content["07. latest trading day"];
    const change = content["09. change"];
    const changePercent = content["10. change percent"];
    if (sy) {
      const sql = `insert IGNORE into daily(symbol, timestamp, open, high, low, close, volume, change_value, change_percent) values (?)`;
      count -= 1;
      console.log(
        symbol + " inserted into database : " + count + " symbols left"
      );
      const array = [
        sy,
        ltd,
        open,
        high,
        low,
        close,
        volume,
        change,
        changePercent,
      ];
      //console.log(array);
      db.query(sql, [array], function (err, rows, fields) {});
    }
    
	} catch (error) {
		console.log(error);
	}
}
async function delayedLog2(symbol) {
	await delay();
	await callAPI2(symbol);
	//console.log(symbol);
}
async function processArray2(symbols) {
	for (const symbol of symbols) {
		await delayedLog2(symbol);
	}
	console.log('Done!');
}

//---------------------------------------------[POST]today----------------------------
router.post("/today", function (req, res) {
  processArray2(symbols);
})


//-------------------------------------------------------------------------------------------------------------------//
router.get("/full-data/:symbol", function (req, res) {
  const symbol = req.params.symbol;
  const sql = `SELECT * from daily where symbol = ?`;
  db.query(sql, symbol, function (err, rows, fields) {
    res.json(rows);
  });
});

router.get("/interval", (req, res) => {
  const symbol = req.query.symbol;
  const period = req.query.period;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  let interval = "";
  let date_notYear = "";
  let sql = "";

  if (req.query.interval > 0) interval = "/" + req.query.interval;

  if (period != "year") date_notYear = 'DATE_FORMAT(timestamp, "%y"), ';

  /* high: highest, low: lowest volume: sum other than that is as it is*/
  sql = `SELECT symbol, DATE_FORMAT(timestamp,'%Y-%m-%d') as date, open,
         max(high) as high, min(low) as low, close, sum(volume)
         FROM daily WHERE symbol = '${symbol}' AND timestamp BETWEEN '${startDate}' AND '${endDate}' GROUP BY ${date_notYear}
         FLOOR(${period}(timestamp)${interval}) ORDER BY date;`;

  /*select name, timestamp, open, max(high) as high, min(low) as low, close, sum(volume) as volume from daily where name = 'aapl' and timestamp between '2020-01-01' and '2022-01-01' group by date_format(timestamp, "%y"), FLOOR(month(timestamp)/1) order by timestamp;*/
  db.query(sql, function (err, rows, fields) {
    if (err) throw err;
    res.json(rows);
    // console.log(rows);
  });
});

module.exports = router;
