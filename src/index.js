// Import npm modules required

const express = require("express");
const cors = require("cors");

// Created the express server.

const app = express();

//Set up server

app.use(cors());
app.use(express.json());

//start the server on port 3000

app.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// Call database

const db = new Database("./src/db/minecraft-api.db", { verbose: console.log });

// Define desired endpoints
