// *********************************************** Authors RELATED ENDPOINTS ******************************************

/* ************************************************* AUTHORS CRUD ENDPOINTS *******************************************
1. CREATE --> POST http://localhost:300/authors/ (+ body)
2. READ --> GET http://localhost:300/authors/ (+ optional query search params)
3. READ (single author) --> GET http://localhost:300/authors/:authorId
4. UPDATE (single author) --> PUT http://localhost:300/authors/:authorId (+ body)
5. DELETE (single author) --> DELETE http://localhost:300/authors/:authorId
*/

import Express from "express";
import uniqid from "uniqid";
import uiavatars from "ui-avatars";
import {
  getAuthors,
  writeAuthors,
  saveAuthorsAvatar,
} from "../../library/fs-tools.js";
import multer from "multer";
import { extname } from "path";

const authorsRouter = Express.Router();

authorsRouter.post("/", async (req, res) => {
  const newAuthor = {
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
    avatar: `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`,
    id: uniqid(),
  };

  const authorsArray = await getAuthors();
  authorsArray.push(newAuthor);
  await writeAuthors(authorsArray);

  res.status(201).send({ id: newAuthor.id });
});

authorsRouter.get("/", async (req, res) => {
  // console.log("REQ.QUERY:", req.query);
  const authors = await getAuthors();
  if (req.query && req.query.category) {
    const filteredAuthors = authors.filter(
      (author) => author.category === req.query.category
    );
    res.send(filteredAuthors);
  } else {
    res.send(authors);
  }
});

authorsRouter.get("/:authorId", async (req, res) => {
  const authorsArray = await getAuthors();

  const foundAuthor = authorsArray.find(
    (author) => author.id === req.params.authorId
  );
  res.send(foundAuthor);
});

authorsRouter.put("/:authorId", async (req, res) => {
  const authorsArray = await getAuthors();

  const index = authorsArray.findIndex(
    (author) => author.id === req.params.authorId
  );

  const oldAuthor = authorsArray[index];

  const updatedAuthor = { ...oldAuthor, ...req.body, updatedAt: new Date() };

  authorsArray[index] = updatedAuthor;

  await writeAuthors(authorsArray);

  res.send(updatedAuthor);
});

authorsRouter.delete("/:authorId", async (req, res) => {
  const authorsArray = getAuthors();

  const remainingAuthors = authorsArray.filter(
    (author) => author.id !== req.params.authorId
  );

  await writeAuthors(remainingAuthors);

  res.status(204).send();
});

authorsRouter.post(
  "/:authorId/uploadAvatar",
  multer().single("avatar"),
  async (req, res, next) => {
    try {
      console.log("FILE: ", req.file);
      console.log("FILE: ", req.body);
      const originalFileExtension = extname(req.file.originalname); //this is to get the extension name of the file eg. ".jpg" or "png"
      const fileName = req.params.authorId + originalFileExtension; // this is adding the authors ID as the name of the file with the extension type of the file
      await saveAuthorsAvatar(fileName, req.file.buffer);

      res.status(201).send({ message: "avatar has been uploaded" });
    } catch (error) {
      next(error);
    }
  }
);

export default authorsRouter;
