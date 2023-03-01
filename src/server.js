// const express = require("express") OLD IMPORT SYNTAX
import Express from "express"; // NEW IMPORT SYNTAX (We can use it only if we add "type": "module", to package.json)
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./api/authors/index.js";

const server = Express();
const port = 3001;

// ******************************MIDDLEWARES***************************
server.use(cors());
server.use(Express.json()); // If you don't add this line BEFORE the endpoints all request bodies will be UNDEFINED!!!!!!!!!!!!!!!

// ************************** ENDPOINTS ***********************

server.use("/authors", authorsRouter);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on port ${port}`);
});

server.on("error", (error) =>
  console.lo(`Server is not running on port ${port} `)
);
