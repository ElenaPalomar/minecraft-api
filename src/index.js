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


// FUNCTIONS

// Function to transform database integers 1 and 0 into the true and false booleans
const booleansTranform = (object) => {
  for (const item of object) {

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
}

// Function to select the query based on the query parameters the user is looking for
const selectQuery = (nameFilterParam, categoryFilterParam, materialFilterParam, allQuerys, nameCategoryQueries, nameMaterialQueries, categoryMaterialQueries, allElements, nameQuery, categoryQuery, materialQuery) => {

  if (nameFilterParam && categoryFilterParam && materialFilterParam) {

    return allQuerys.all(`%${nameFilterParam}%`, `%${categoryFilterParam}%`, `%${materialFilterParam}%`);

  } else if (nameFilterParam && categoryFilterParam) {

    return nameCategoryQueries.all(`%${nameFilterParam}%`, `%${categoryFilterParam}%`);

  } else if (nameFilterParam && materialFilterParam) {

    return nameMaterialQueries.all(`%${nameFilterParam}%`, `%${materialFilterParam}%`);

  } else if (categoryFilterParam && materialFilterParam) {

    return categoryMaterialQueries.all(`%${categoryFilterParam}%`, `%${materialFilterParam}%`);

  } else if (!nameFilterParam && !categoryFilterParam && !materialFilterParam) {

    return allElements.all();

  } else if (nameFilterParam) {

    return nameQuery.all(`%${nameFilterParam}%`);

  } else if (categoryFilterParam) {

    return categoryQuery.all(`%${categoryFilterParam}%`);

  } else if (materialFilterParam) {

    return materialQuery.all(`%${materialFilterParam}%`);

  }

}

const query = (req) => {

  const queryParams = [
    {
      param: req.query.name,
      name: 'name'
    },
    {
      param: req.query.category,
      name: 'category'
    },
    {
      param: req.query.material,
      name: 'material'
    },
    {
      param: req.query.mineable,
      name: 'mineable'
    },
    {
      param: req.query.overworld,
      name: 'overworld'
    },
    {
      param: req.query.nether,
      name: 'nether'
    },
    {
      param: req.query.end,
      name: 'end'
    },
  ];

  for (const item of queryParams) {

    /* if (item.param === req.query.mineable) {

      const itemQuery = db.prepare(`SELECT * FROM blocks WHERE ${item.name} LIKE ?`);
      return itemQuery.all(item.param);

    } */ /* else if (item.param === req.query.overworld || item.param === req.query.nether || item.param === req.query.end) {

      const itemQuery = db.prepare(`SELECT * FROM blocks WHERE ${item.name} = 1`);
      return itemQuery.all();

    } */ /* else */ //if (item.param) {

    //      const itemQuery = db.prepare(`SELECT * FROM blocks WHERE ${item.name} LIKE ?`);
    //      return itemQuery.all(`%${item.param}%`); // Funciona para todas las categorías pero, para mineable, si buscas axe, te devuelve piaxe y axe

    /* } */ /* else if (item.param === null || item.param === '') {

      const itemQuery = db.prepare(`SELECT * FROM blocks`);
      return itemQuery.all();

    } */
  }
}


// ENDPOINTS

// Endpoint that returns all elements blocks searched by name
app.get("/blocks", (req, res) => {

  // query params
  const nameFilterParam = req.query.name;
  const categoryFilterParam = req.query.category;
  const materialFilterParam = req.query.material;
  const mineableFilterParam = req.query.mineable;
  const overwoldFilterParam = req.query.overworld;
  const netherFilterParam = req.query.nether;
  const endFilterParam = req.query.end;

  // prepare the query
  const allQuerys = db.prepare(`SELECT * FROM blocks WHERE name LIKE ? AND category LIKE ? AND material LIKE ? `);
  const nameCategoryQueries = db.prepare(`SELECT * FROM blocks WHERE name LIKE ? AND category LIKE ? `);
  const nameMaterialQueries = db.prepare(`SELECT * FROM blocks WHERE name LIKE ? AND material LIKE ? `);
  const categoryMaterialQueries = db.prepare(`SELECT * FROM blocks WHERE category LIKE ? AND material LIKE ? `);
  const allElements = db.prepare(`SELECT * FROM blocks`);
  const nameQuery = db.prepare(`SELECT * FROM blocks WHERE name LIKE ? `);
  const categoryQuery = db.prepare(`SELECT * FROM blocks WHERE category LIKE ? `);
  const materialQuery = db.prepare(`SELECT * FROM blocks WHERE material LIKE ? `);

  //execute the query
  const blockData = selectQuery(nameFilterParam, categoryFilterParam, materialFilterParam, allQuerys, nameCategoryQueries, nameMaterialQueries, categoryMaterialQueries, allElements, nameQuery, categoryQuery, materialQuery);

  //  const blockData = query(req);

  booleansTranform(blockData);

  // server response
  const response = {
    success: true,
    blocks: blockData
  };

  // send server response in json format
  res.json(response);

  // Cuando el arrays de respuesta está vacío, es decir, cuando la búsqueda es errónea, el servidor devuelve un 'true' porque la petición es correcta, pero si no hay ningún elemento que cumpla las condiciones de búsqueda ¿sería un error 204? 
  // 204 NO CONTENT	Indica que se ha aceptado la solicitud, pero no había datos para devolver. Este respuesta se devuelve cuando se ha procesado la solicitud, pero no se ha devuelto ninguna información adicional acerca de los resultados.
  // En otra página he encontrado que lo mejor es poner un estado de 200 y un array vacío, y en las APIs con las que hemos trabajado se procede así
  /* if (blockData.length !== 0) {
    res.json(response);
  } else {
    res.sendStatus(204); //Sets the response HTTP status code to statusCode and sends the registered status message as the text response body. If an unknown status code is specified, the response body will just be the code number.
    res.send('La solicitud es correcta pero no hay datos para devolver');
    // Creo que es más correcto:
    res.status(204).send("Sorry! There is no item with this values.")
  } */
});


// STATIC SERVERS

// Static server of images
const staticServerImagesPathWeb = "./src/public-images/";
app.use(express.static(staticServerImagesPathWeb));
