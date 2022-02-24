const router = require("express").Router();
const algoliasearch = require("algoliasearch");
const dotenv = require("dotenv");
const db = require("../app.js");

dotenv.config();

// Algolia client credentials
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_API_KEY = process.env.ALGOLIA_API_KEY;
const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME;


//remove all objects (쓸 일 없음)
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
    const sql = `SELECT symbol, name, kr_name FROM company_info`;
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
    let res = await index.search("");
    console.log("Current objects: ", res.hits); //결과 : Current objects:  []

    //-------------------------------저장------------------------------
    // Save objects: Add multiple objects to an index
    //console.log("Save objects - Adding multiple objects: ", dataobjects);
    await index.saveObjects(dataobjects, {'autoGenerateObjectIDIfNotExist': true}).wait(); //저장 //dataobjects = [ {~~}, {~~} ]

    res = await index.search("");
    console.log("Current objects: ", res.hits); // 결과 : 저장된 애들
    
  
  } catch (error) {
    console.error(error);
  }
};

// /search/store
router.post("/store", function (req, res) {
  storedata();
});

//keyword로 search
async function searchdata(endpoint) {
  try {
    // Initialize the client
    const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
    // Initialize an index
    const index = client.initIndex(ALGOLIA_INDEX_NAME);

    res = await index.search(endpoint, {attributesToRetrieve : 'symbol'} );
    //console.log(res);
    console.log(res.hits); //콘솔로 확인
    return res.hits;
  
  } catch (error) {
    console.error(error);
  }
};

// /search/:keyword
router.get("/:keyword", function (req, res) {
  let keyword = req.params.keyword;

  searchdata(keyword).then((result) => {
    res.json(result);
  });

});



module.exports = router;
