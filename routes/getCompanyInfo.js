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

/* 언제 쓴거지..?
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
*/
// image가져오기 
//UPDATE `stockserver`.`company_info` SET `img` = '<!-- by TradingView --><svg width=\"56\" height=\"56\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"#008FFE\" d=\"M0 0h56v56H0z\"/><path d=\"M28 10.33a.599.599 0 100-1.198.599.599 0 000 1.197zm.893 2.865a.894.894 0 11-1.787 0 .894.894 0 011.787 0zM28 18.368a1.271 1.271 0 100-2.542 1.271 1.271 0 000 2.542zm0 5.45a1.834 1.834 0 100-3.667 1.834 1.834 0 000 3.667zm1.834 10.196a1.834 1.834 0 10-3.668 0 1.834 1.834 0 003.668 0zM28 37.631a1.271 1.271 0 110 2.542 1.271 1.271 0 010-2.542zm.893 5.173a.894.894 0 10-1.787 0 .894.894 0 001.787 0zM28 45.67a.599.599 0 110 1.197.599.599 0 010-1.197zm6.015-15.837a1.834 1.834 0 110-3.667 1.834 1.834 0 010 3.667zM37.632 28a1.271 1.271 0 102.542 0 1.271 1.271 0 00-2.542 0zm5.173.893a.894.894 0 110-1.787.894.894 0 010 1.787zM45.67 28a.599.599 0 101.198 0 .599.599 0 00-1.198 0zm-23.685 1.833a1.834 1.834 0 100-3.667 1.834 1.834 0 000 3.667zM18.368 28a1.27 1.27 0 11-2.542 0 1.27 1.27 0 012.542 0zm-5.173.893a.894.894 0 100-1.787.894.894 0 000 1.787zM10.33 28a.599.599 0 11-1.198 0 .599.599 0 011.198 0zm23.22-2.957a1.833 1.833 0 11-2.594-2.593 1.833 1.833 0 012.593 2.593zm1.26-3.854a1.271 1.271 0 101.798-1.797 1.271 1.271 0 00-1.797 1.797zm4.29-3.026a.894.894 0 11-1.263-1.264.894.894 0 011.264 1.264zm1.395-2.658a.599.599 0 10.847-.847.599.599 0 00-.847.847zM25.044 33.549a1.834 1.834 0 10-2.594-2.593 1.834 1.834 0 002.594 2.593zm-3.855 1.261a1.27 1.27 0 11-1.797 1.798 1.27 1.27 0 011.797-1.798zm-3.026 4.29a.894.894 0 10-1.263-1.264.894.894 0 001.264 1.264zm-2.658 1.394a.599.599 0 11-.847.847.599.599 0 01.847-.847zm15.452-6.945a1.834 1.834 0 112.593-2.593 1.834 1.834 0 01-2.593 2.593zm3.854 1.261a1.271 1.271 0 101.797 1.798 1.271 1.271 0 00-1.797-1.798zm3.026 4.29a.894.894 0 111.264-1.264.894.894 0 01-1.264 1.264zm2.658 1.394a.599.599 0 10.846.847.599.599 0 00-.846-.847zM22.45 25.044a1.834 1.834 0 102.593-2.594 1.834 1.834 0 00-2.593 2.593zm-1.26-3.855a1.271 1.271 0 11-1.798-1.798 1.271 1.271 0 011.797 1.798zm-4.29-3.026a.894.894 0 101.264-1.264.894.894 0 00-1.264 1.264zm-1.395-2.658a.599.599 0 11-.847-.847.599.599 0 01.847.847z\" fill=\"#fff\"/></svg>' WHERE (`symbol` = 'A');
//로 company_info 테이블 img컬럼에 심볼 A만 (svg파일 자체를)저장해봄
//UPDATE `stockserver`.`company_info` SET `img` = '../img/AAL.svg' WHERE (`symbol` = 'AAL');
//img컬럼 심볼 AAL에는 '경로'저장
router.get("/:symbol", function (req, res) {
  const symbol = req.params.symbol;
  const sql = `SELECT img from company_info where symbol = ?`;
  db.query(sql, symbol, function (err, rows, fields) {
    //console.log(rows);
    //res.send(rows);
    /* 1 */
    //-----svg파일 자체를 저장했을 때 ) 테스트 (A사용)
    //http://localhost:8080/company-info/A
    txt = JSON.parse(JSON.stringify(rows))[0].img;
    console.log(rows);
    res.send(txt);

    /* 2
    //----경로 저장했을 때) 테스트 (AAL사용)
    //http://localhost:8080/company-info/AAL
    //console.log(JSON.parse(JSON.stringify(rows))[0].img);
    
    console.log(path.join(__dirname,'../img/AAL.svg'));
    routetxt = JSON.parse(JSON.stringify(rows))[0].img;
    console.log(path.join(__dirname, routetxt));

    //res.sendFile(path.join(__dirname,'../img/AAL.svg')); //DB에서 꺼내온거아님
    res.sendFile(path.join(__dirname, routetxt)); 
    */
  });
});

module.exports = router;
