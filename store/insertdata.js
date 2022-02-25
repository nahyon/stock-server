const router = require("express").Router();
const db = require("../app.js");
const axios = require("axios");
const API_KEY = process.env.ALPHAVANTAGEAPI;

//  /store

//-------------------------------------Intraday(5min)------------------------------
//(TIME_SERIES_INTRADAY, interval = 5min)------------------------------------------------------------
async function intraday5minapi(symbol, url) {
	try {
		const response = await axios.get(url);   //요청
    //console.log(response.data);
    const res = response.data;
    content = res["Time Series (5min)"] 

    if (content) {
      const keys = Object.keys(content); 
      // console.log(keys);

      const sql = `insert IGNORE into intraday(symbol, timestamp, open, high,low,close,volume) values (?)`;
     
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
//-------------------------------------daily------------------------------
//(TIME_SERIES_DAILY)------------------------------------------------------------
async function dailyapi(symbol, url) {
	try {
		const response = await axios.get(url);   //요청
    //console.log(response.data);
    const res = response.data;
    const content = res["Time Series (Daily)"];
    
    // -- 추가 필요 : 정해진 날짜의 범위만큼 가져오는 것 -- //
    /*
      매일 하루도빠짐없이 잘 받아올거라는 생각 X. 
      ex) 3일 전 받아왔고, 오늘 받아온다면 ? 빠진 날짜들 포함해서 가져와야한다. 
      (사실 SQL문 insert IGNORE로 해결될거라고 생각하는데.. 
        timestamp컬럼 날짜를 가져오는 날 날짜랑 비교해서 or 어떤 범위를 주면 그 범위만큼 가져오라는 건가봐요)
      ex) 
      - 특정날짜(오늘-4일)와 같은 날 : 'SELECT * FROM daily WHERE date(timestamp) = date(now())-4'
      - 오늘-6일 전부터 최근까지     : 'SELECT * FROM daily WHERE date(timestamp) >= date(now())-6'
    */

    if (content) {
      const keys = Object.keys(content);
      // console.log(keys)

      const sql = `insert IGNORE into daily(symbol, timestamp, open, high, low, close, volume) values (?)`;

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

    // -- 추가 필요 change, changePercent -- //
    //오늘의 change = (오늘 close) - (전날 close) 
    //오늘의 changePercent = (오늘의 change) / (전날 close)
    //sql = `insert into daily(change, changePercent) values (?)`;

    // -- 추가 필요 marketCap -- //
    //marketCap도 회사정보가 아닌 daily테이블에 넣는다->  function = OVERVIEW인 api호출해서 추가해야함

    
	} catch (error) {
		console.log(error);
	}
}


function delay() {
	return new Promise(resolve => setTimeout(resolve, 12050)); //12초이상 (5call/분)
}

async function delayedLog(symbol, url, func) {
	await delay(); //12.050초

  if (func === "intraday5min") {
    await intraday5minapi(symbol, url);
  }
  if (func === "daily") {
    await dailyapi(symbol, url);
  }
}



/*
url = {
  companyinfo : `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`,
  intraday5min :  `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&outputsize=full&apikey=${API_KEY}` ,
  daily:  `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${API_KEY}`
}
*/

router.get("/:func", function (req, res) { //store/:func
  const func = req.params.func;
  async function processArray() {
    const sql = `select symbol from company_info;`;
    db.query(sql, async (err, results) => {
      try {
        let cnt = 500;
        let url = ``;
        for (let res of results) {
          let symbol = res.symbol;

          if (func === "intraday5min") {
            url =  `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&outputsize=full&apikey=${API_KEY}`;          
          }
          if (func === "daily") {
            url =  `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${API_KEY}`;
          }
          console.log(symbol + " insert . . . . . ." +  cnt + " symbols left");

          await delayedLog(symbol, url, func);
          
          cnt -= 1;
        }
        console.log('Done!');
      } catch (exception) {
        console.log(exception);
      }
    });
  }
  processArray();
});


module.exports = router;
