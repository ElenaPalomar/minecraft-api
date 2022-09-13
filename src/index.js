// Import npm modules required
const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");


// SERVER

// Created the express server
const app = express();

// Set up server
app.use(cors());
app.use(express.json());

// Start the deploy server on port 4000
const serverPort = 4000;
app.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});


// DATABASE

// Call database
const db = new Database("./src/db/minecraft-api.db", { verbose: console.log });


// ENDPOINTS

// Endpoint that returns all elements blocks
/* app.get("/blocks", (req, res) => {
  //prepare the query
  const query = db.prepare("SELECT * FROM blocks");
  //execute the query
  const blocks = query.all();
  res.json(blocks);
}); */

// Endpoint that returns all elements blocks searched by name
app.get("/blocks", (req, res) => {
  // query params
  const nameFilterParam = req.query.name;

  // prepare the query
  const query = db.prepare(`SELECT * FROM blocks WHERE name LIKE ?`);
  //execute the query
  const blockData = query.all(`%${nameFilterParam}%`);

  for (const item of blockData) {

    if (item.overworld === 1) {
      item.overworld = true;
    } else {
      item.overworld = false;
    }

    if (item.nether === 1) {
      item.nether = true;
    } else {
      item.nether = false;
    }

    if (item.end === 1) {
      item.end = true;
    } else {
      item.end = false;
    }

  }

  // server response
  const response = {
    success: true,
    blocks: blockData,
  };

  // send server response in json format
  res.json(response);
});


// STATIC SERVERS

// Static server of images
const staticServerImagesPathWeb = "./src/public-images/";
app.use(express.static(staticServerImagesPathWeb));
