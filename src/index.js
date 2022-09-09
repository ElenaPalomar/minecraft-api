// Import npm modules required

const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

// Created the express server.

const app = express();

//Set up server

app.use(cors());
app.use(express.json());

//start the deploy server on port 4000
const serverPort = 4000;
app.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// Call database

const db = new Database("./src/db/minecraft-api.db", { verbose: console.log });

/* // Define desired endpoints
app.get("/blocks", (req, res) => {
  //prepare the query
  const query = db.prepare("SELECT * FROM blocks");
  //execute the query
  const blocks = query.all();
  res.json(blocks);
}); */

//endpoint 2 //
app.get("/blocks", (req, res) => {
  // query params
  const nameFilterParam = req.query.name;

  const query = db.prepare(`SELECT * FROM blocks WHERE name LIKE ?`);
  const blockData = query.get(nameFilterParam);

  // server response
  const response = {
    success: true,
    blocks: blockData,
  };

  // send server response in json format
  res.json(response);
});

// static server of images

const staticServerImagesPathWeb = "./src/public-images/";
app.use(express.static(staticServerImagesPathWeb));
