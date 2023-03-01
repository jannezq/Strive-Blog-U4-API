// *********************************************** Authors RELATED ENDPOINTS ******************************************

/* ************************************************* AUTHORS CRUD ENDPOINTS *******************************************
1. CREATE --> POST http://localhost:300/authors/ (+ body)
2. READ --> GET http://localhost:300/authors/ (+ optional query search params)
3. READ (single author) --> GET http://localhost:300/authors/:authorId
4. UPDATE (single author) --> PUT http://localhost:300/authors/:authorId (+ body)
5. DELETE (single author) --> DELETE http://localhost:300/authors/:authorId
*/

import Express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import uiavatars from "ui-avatars";

const authorsRouter = Express.Router();

const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
);
const getAuthors = () => JSON.parse(fs.readFileSync(authorsJSONPath));
const writeAuthors = (authorsArray) =>
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));

authorsRouter.post("/", (req, res) => {
  const avatarURL = uiavatars.generateAvatar({
    uppercase: true,
    name: req.body.name + req.body.surname,
    background: "990000",
    color: "000000",
    fontsize: 0.5,
    bold: true,
    length: 2,
    rounded: true,
    size: 250,
  });
  const newAuthor = {
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
    avatar: avatarURL,
    id: uniqid(),
  };

  const authorsArray = getAuthors();
  authorsArray.push(newAuthor);
  writeAuthors(authorsArray);

  res.status(201).send({ id: newAuthor.id });
});

authorsRouter.get("/", (req, res) => {
  console.log("REQ.QUERY:", req.query);
  const authors = getAuthors();
  if (req.query && req.query.category) {
    const filteredAuthors = authors.filter(
      (author) => author.category === req.query.category
    );
    res.send(filteredAuthors);
  } else {
    res.send(authors);
  }
});

authorsRouter.get("/:authorId", (req, res) => {
  const authorsArray = getAuthors();

  const foundAuthor = authorsArray.find(
    (author) => author.id === req.params.authorId
  );
  res.send(foundAuthor);
});

authorsRouter.put("/:authorId", (req, res) => {
  const authorsArray = getAuthors();

  const index = authorsArray.findIndex(
    (author) => author.id === req.params.authorId
  );

  const oldAuthor = authorsArray[index];

  const updatedAuthor = { ...oldAuthor, ...req.body, updatedAt: new Date() };

  authorsArray[index] = updatedAuthor;

  writeAuthors(authorsArray);

  res.send(updatedAuthor);
});

authorsRouter.delete("/:authorId", (req, res) => {
  const authorsArray = getAuthors();

  const remainingAuthors = authorsArray.filter(
    (author) => author.id !== req.params.authorId
  );

  writeAuthors(remainingAuthors);

  res.status(204).send();
});

export default authorsRouter;
