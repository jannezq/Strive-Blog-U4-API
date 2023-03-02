import Express from "express";
// import cors from "cors";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./api/authors/index.js";
import blogPostsRouter from "./api/blogPosts/index.js";
// importing the errorHandler below~~~
import {
  badRequestHandler,
  unauthorizedHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandlers.js";
import { join } from "path";

const server = Express();
const port = 3001;
const publicFolderPath = join(process.cwd(), "./public");

// ******************************GLOBAL MIDDLEWARES***************************
const loggerMiddleware = (req, res, next) => {
  console.log(
    `Request method ${req.method} -- url ${req.url} -- ${new Date()}`
  );
  req.user = "Jovellyn";
  next(); // <<<<===== this is a next normal flow
};

const authenicationOfficerMiddleware = (req, res, next) => {
  console.log("Checking if you are the correct user!");
  if (req.user === "Jovellyn") {
    console.log("Welcome Jovellyn!");
    next();
  } else {
    res.status(401).send({ message: "Sorry you are not the correct user!" });
  }
};

server.use(Express.static(publicFolderPath));
server.use(loggerMiddleware); //<<<----- global middleware
server.use(authenicationOfficerMiddleware);
server.use(Express.json()); // If you don't add this line BEFORE the endpoints all request bodies will be UNDEFINED!!!!!!!!!!!!!!! <<<< this is also a middlewares

// ************************** ENDPOINTS ***********************

server.use("/authors", authorsRouter);
server.use("/blogPosts", blogPostsRouter);

// ************************* ERROR HANDLERS *******************
server.use(badRequestHandler); // 400
server.use(unauthorizedHandler); // 401
server.use(notFoundHandler); // 404
server.use(genericErrorHandler); // 500 (this should ALWAYS be the last one)

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on port ${port}`);
});
