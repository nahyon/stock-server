const router = require("express").Router();
const db = require("../app.js");
const axios = require("axios");
const API_KEY = process.env.ALPHAVANTAGEAPI;

//심볼 500개 정한거 리스트로 가져오기 (예시는 밑 6개만 사용. 500개로 변경하기)
//const symbols = ['AAPL', 'MSFT', 'GOOG', 'AMZN', 'TSLA', 'FB']
/* 총 497개
['AAPL', 'MSFT', 'GOOG', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'FB', 'V', 'JPM', 'UNH', 'JNJ', 'PG', 'WMT', 'BAC', 'MA', 'HD', 'XOM', 'DIS', 'PFE', 'KO', 'CVX', 'ABBV', 'CSCO', 'AVGO', 'PEP', 'LLY', 'COST', 'NKE', 'VZ', 'WFC', 'TMO', 'CMCSA', 'ADBE', 'ABT', 'ACN', 'ORCL', 'CRM', 'MRK', 'DHR', 'QCOM', 'MCD', 'AMD', 'INTC', 'UPS', 'NFLX', 'PM', 'T', 'MS', 'SCHW', 'UNP', 'LIN', 'TMUS', 'TXN', 'LOW', 'AXP', 'BMY', 'NEE', 'RTX', 'INTU', 'MDT', 'CVS', 'C', 'HON', 'AMGN', 'BA', 'PYPL', 'AMAT', 'COP', 'GS', 'BLK', 'DE', 'IBM', 'NOW', 'EL', 'ANTM', 'BKNG', 'SBUX', 'PLD', 'LMT', 'AMT', 'CAT', 'CHTR', 'GE', 'MU', 'ISRG', 'TGT', 'MO', 'SYK', 'MDLZ', 'SPGI', 'CB', 'CME', 'USB', 'PNC', 'ADI', 'MMM', 'ADP', 'TFC', 'LRCX', 'TJX', 'CSX', 'DUK', 'MMC', 'GILD', 'HCA', 'BDX', 'CI', 'F', 'GM', 'SHW', 'CCI', 'ICE', 'SO', 'ITW', 'CL', 'REGN', 'EW', 'EOG', 'NSC', 'D', 'COF', 'ATVI', 'FCX', 'EQIX', 'PGR', 'FISV', 'ETN', 'NOC', 'AON', 'BSX', 'PSA', 'MCO', 'GD', 'MRNA', 'WM', 'FDX', 'VRTX', 'FIS', 'MET', 'MAR', 'PXD', 'SLB', 'EMR', 'KLAC', 'NEM', 'APD', 'HUM', 'SPG', 'AIG', 'ECL', 'FTNT', 'NXPI', 'ILMN', 'CNC', 'ADSK', 'KHC', 'TEL', 'ROP', 'DG', 'JCI', 'APH', 'CTSH', 'BK', 
'ORLY', 'KMB', 'MPC', 'DOW', 'SNPS', 'IQV', 'SRE', 'PRU', 'MNST', 'ADM', 'MSCI', 'INFO', 'LHX', 'CMG', 'AEP', 'SYY', 'HLT', 'PAYX', 'HSY', 'IDXX', 'BAX', 'TRV', 'AFL', 'GIS', 'STZ', 'EXC', 'MCK', 'DD', 'WBA', 'MCHP', 'A', 'AZO', 'DLR', 'ALGN', 'HPQ', 'GPN', 'ANET', 'PH', 'CTAS', 'APTV', 'CARR', 'O', 'KMI', 'CDNS', 'PSX', 'RSG', 'WELL', 'DXCM', 'OXY', 'CTVA', 'MSI', 'DVN', 'EA', 'YUM', 'SIVB', 'LVS', 'TDG', 'WMB', 'XEL', 'DFS', 'TT', 'PPG', 'VLO', 'ALL', 'GLW', 'EBAY', 'IFF', 'STT', 'RMD', 'KR', 'TSN', 'NUE', 'CBRE', 'AMP', 'ODFL', 'ROST', 'LYB', 'FITB', 'EQR', 'TROW', 'AVB', 'PEG', 'PCAR', 'EXPE', 'OTIS', 'AJG', 'DLTR', 'MTD', 'SBAC', 'CMI', 'BIIB', 'ROK', 'VRSK', 'MTCH', 'FRC', 'ED', 'BKR', 'ARE', 'AME', 'ABC', 'DHI', 'FAST', 'KEYS', 'BLL', 'WY', 'HES', 'CPRT', 'HAL', 'NDAQ', 'ES', 'WEC', 'OKE', 'WTW', 'TWTR', 'DAL', 'WST', 'LUV', 'AWK', 'CERN', 'LYV', 'SWK', 'LEN', 'EXR', 'MKC', 'ANSS', 'EFX', 'CCL', 'HRL', 'EPAM', 'CDW', 'NTRS', 'LH', 'VMC', 'GWW', 'TSCO', 'MAA', 'CHD', 'MLM', 'FANG', 'KEY', 'STX', 'IT', 'HIG', 'MTB', 'BBY', 'FE', 'DTE', 'VRSN', 'VFC', 'DOV', 'FOX', 'FOXA', 'FTV', 'HBAN', 'EIX', 'SYF', 'STE', 'PKI', 'K', 'URI', 'HPE', 'RJF', 'CFG', 'SWKS', 'RF', 'ALB', 'GRMN', 'AEE', 'IR', 'RCL', 'ESS', 'MPWR', 'VTR', 'ETR', 'DRE', 'ULTA', 'SBNY', 'NTAP', 'CINF', 'JBHT', 'MGM', 'PPL', 'TDY', 'WAT', 'PAYC', 'COO', 'BXP', 'PFG', 'ENPH', 'GNRC', 'TER', 'BRO', 'CLX', 'DRI', 'CTRA', 'TTWO', 'POOL', 'FLT', 'CMS', 'IP', 'WAB', 'GPC', 'EXPD', 'AMCR', 'VTRS', 'BIO', 'CTLT', 'OMC', 'UDR', 'HOLX', 'WDC', 'CAG', 'NVR', 'TRMB', 'PEAK', 'KMX', 'MRO', 'CZR', 'TYL', 'CNP', 'MOS', 'BR', 'XYL', 'EMN', 'NLOK', 'AKAM', 'ETSY', 'WRB', 'DPZ', 'TECH', 'CF', 'DGX', 'CE', 'J', 'UAL', 'TXT', 'ROL', 'DISH', 'L', 'BEN', 'FDS', 'INCY', 
'DISCK', 'DISCA', 'SJM', 'CAH', 'AVY', 'CEG', 'CRL', 'FMC', 'TFX', 'KIM', 'PWR', 'HWM', 'QRVO', 'IEX', 'ATO', 'LKQ', 'LNT', 'IPG', 'AES', 'MKTX', 'PKG', 'EVRG', 'MAS', 'HST', 'SEDG', 'ABMD', 'CPB', 'HAS', 'AAP', 'NDSN', 'RHI', 'NWS', 'NWSA', 'LDOS', 'CTXS', 'BBWI', 'PTC', 'CBOE', 'CMA', 'JKHY', 'IRM', 'LNC', 'WRK', 'FFIV', 'FBHS', 'XRAY', 'WHR', 'PHM', 'CHRW', 'RE', 'APA', 'AAL', 'SNA', 'HSIC', 'REG', 'AOS', 'NI', 'JNPR', 'DVA', 'NWL', 'UHS', 'WYNN', 'TAP', 'GL', 'BWA', 'TPR', 'SEE', 'IVZ', 'LUMN', 'CDAY', 'ALLE', 'MHK', 'LW', 'PNR', 'AIZ', 'NRG', 'FRT', 'OGN', 'VNO', 'RL', 'PBCT', 'NCLH', 'DXC', 'PENN', 'PNW', 'HII', 'UAA', 'UA', 'IPGP', 'PVH', 'NLSN']
*/
const symbols = ['CAG', 'NVR', 'TRMB', 'PEAK', 'KMX', 'MRO', 'CZR', 'TYL', 'CNP', 'MOS', 'BR', 'XYL', 'EMN', 'NLOK', 'AKAM', 'ETSY', 'WRB', 'DPZ', 'TECH', 'CF', 
'DGX', 'CE', 'J', 'UAL', 'TXT', 'ROL', 'DISH', 'L', 'BEN', 'FDS', 'INCY', 'DISCK', 'DISCA', 'SJM', 'CAH', 'AVY', 'CEG', 'CRL', 'FMC', 'TFX', 'KIM', 'PWR', 'HWM', 'QRVO', 'IEX', 'ATO', 'LKQ', 'LNT', 'IPG', 'AES', 'MKTX', 'PKG', 'EVRG', 'MAS', 'HST', 'SEDG', 'ABMD', 'CPB', 'HAS', 'AAP', 'NDSN', 'RHI', 'NWS', 'NWSA', 'LDOS', 'CTXS', 'BBWI', 'PTC', 'CBOE', 'CMA', 'JKHY', 'IRM', 'LNC', 'WRK', 'FFIV', 'FBHS', 'XRAY', 'WHR', 'PHM', 'CHRW', 'RE', 'APA', 'AAL', 'SNA', 'HSIC', 'REG', 'AOS', 'NI', 'JNPR', 'DVA', 'NWL', 'UHS', 'WYNN', 'TAP', 'GL', 'BWA', 'TPR', 'SEE', 'IVZ', 'LUMN', 'CDAY', 'ALLE', 'MHK', 'LW', 'PNR', 'AIZ', 'NRG', 'FRT', 'OGN', 'VNO', 'RL', 'PBCT', 'NCLH', 'DXC', 'PENN', 'PNW', 'HII', 'UAA', 'UA', 'IPGP', 'PVH', 'NLSN']

//-------------------------------------CompanyInfo------------------------------
async function companyinfoapi(symbol, url) {
  try {
		const response = await axios.get(url);   
    //console.log(response.data);
    const res = response.data;

    const description = res["Description"];
    const marketCap = res["MarketCapitalization"];
    const name = res["Name"];
    //console.log(description, marketCap, name);

    if (marketCap) {
      const sql = `insert IGNORE into company_info(symbol, name, description, cap) values (?)`;
      const array = [symbol, name, description, marketCap];
      db.query(sql, [array], function (err, rows, fields) {});
    }
    
	} catch (error) {
		console.log(error);
	}
}  


function delay() {
	return new Promise(resolve => setTimeout(resolve, 12050));//12초이상 (5call/분)
}
async function delayedLog(symbol, url) {
	await delay();
	await companyinfoapi(symbol, url);
}



router.get("/", async (req, res) => {
  let cnt = 500;
  for (const symbol of symbols) {
    const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`;

    console.log(symbol + " insert . . . " +  cnt + " symbols left");
		await delayedLog(symbol, url);
    cnt-=1;
	}
	console.log('--Done!');
})



module.exports = router;
