const router = require("express").Router();
const algoliasearch = require("algoliasearch");
const dotenv = require("dotenv");
const db = require("../app.js");

dotenv.config();
//알고리아, 서버 데이터 유지 아이콘. . 이미지url.. 서버는 바뀌었는데 알고리아는 안바뀌는 일 일어나지않게 
// Algolia client credentials
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_API_KEY = process.env.ALGOLIA_API_KEY;
const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME;


//remove all objects (쓸 일 없음)
/* remove기능 추가 
  DB에서 symbol지울 때 algolia에서도 해당 symbol지우도록 코드 추가하기
*/
router.get("/removeall", function (req, res) {
  (async () => {
    // Initialize the client
    const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
    // Initialize an index
    const index = client.initIndex(ALGOLIA_INDEX_NAME);

    await index.clearObjects().wait();
    result = await index.search("");
    console.log("Current objects: ", result.hits);
  })();
})


function datafromDB() {
  return new Promise(function (resolve, reject) {
    const sql = `SELECT objectID, symbol, name, kr_name FROM company_info`; /* objectID추가함 */ 
    db.query(sql, function (err, rows, fields) {
        //const parsing = JSON.parse(JSON.stringify(rows)); 
        //resolve(parsing);
        const rowstrings = JSON.stringify(rows);
        resolve(rowstrings);
    });
    //resolve(parsing);
    //resolve(rowstrings);
  })
}


async function storedata() {
  try {

    // Initialize the client
    const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
    // Initialize an index
    const index = client.initIndex(ALGOLIA_INDEX_NAME);

    const rowstrings = await datafromDB();
    const dataobjects = JSON.parse(rowstrings); //dataobjects = [ {~~}, {~~} ]
    //console.log(dataobjects);
    
    //------------------------------현재 저장된 것---------------------------
    // We don't have any objects (yet) in our index
    // let res = await index.search("");
    // console.log("Current objects: ", res.hits); //결과 : Current objects:  []

    //-------------------------------저장------------------------------
    // Save objects: Add multiple objects to an index
    //console.log("Save objects - Adding multiple objects: ", dataobjects);
    await index.saveObjects(dataobjects).wait(); //저장 //dataobjects = [ {~~}, {~~} ]

    //res = await index.search("");
    //console.log("Current objects: ", res.hits); // 결과 : 저장된 애들
    
  
  } catch (error) {
    console.error(error);
  }
};

// //searchstore
router.post("/", function (req, res) {
  storedata();
});



module.exports = router;
