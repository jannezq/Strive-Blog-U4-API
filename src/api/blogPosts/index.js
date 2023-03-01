// *********************************************** BLOGPOSTS RELATED ENDPOINTS ******************************************

/* ************************************************* BLOGPOSTS CRUD ENDPOINTS *******************************************
1. CREATE --> POST http://localhost:300/blogPost/ (+ body)
2. READ --> GET http://localhost:300/blogPosts/ (+ optional query search params)
3. READ (single blogPost) --> GET http://localhost:300/blogPosts/:blogPostId
4. UPDATE (single blogPost) --> PUT http://localhost:300/blogPosts/:blogPostId (+ body)
5. DELETE (single blogPost) --> DELETE http://localhost:300/blogPosts/:blogPostId
*/

import Express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
// import uiavatars from "ui-avatars";

const blogPostsRouter = Express.Router();

const blogPostsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogPosts.json"
);

const getBlogPosts = () => JSON.parse(fs.readFileSync(blogPostsJSONPath));
const writeBlogPost = (blogPostArray) => {
  fs.writeFileSync(blogPostsJSONPath, JSON.stringify(blogPostArray));
};

blogPostsRouter.post("/", (req, res, next) => {
  try {
    const newBlogPost = {
      ...req.body,
      author: {
        ...req.body.author,
        avatar: `https://ui-avatars.com/api/?name=${req.body.name}`,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      id: uniqid(),
    };

    const blogPostsArray = getBlogPosts();
    blogPostsArray.push(newBlogPost);
    writeBlogPost(blogPostsArray);

    res.status(201).send({ id: newBlogPost.id });
  } catch (error) {
    next(500).send({ message: error.message });
  }
});

//get all blogPosts by title
blogPostsRouter.get("/", (req, res, next) => {
  const blogPosts = getBlogPosts();
  if (req.query && req.query.title) {
    const blogPostTitleSearch = blogPosts.filter(
      (blogTitle) => blogTitle.title === req.query.title
    );
    res.send(blogPostTitleSearch);
  } else {
    res.send(blogPosts);
  }
});

blogPostsRouter.get("/:blogPostId", (req, res, next) => {
  try {
    const blogPostArray = getBlogPosts();

    const foundBlogPost = blogPostArray.find(
      (blog) => blog.id === req.params.blogPostId
    );
    if (foundBlogPost) {
      res.send(foundBlogPost);
    } else {
      // the book has not been found, I'd like to trigger a 404 error
      next(
        createHttpError(404, `Book with id ${req.params.blogPostId} not found!`)
      ); // this jumps to the error handlers
    }
  } catch (error) {
    next(error); // This error does not have a status code, it should trigger a 500
  }
});
blogPostsRouter.put("/");

blogPostsRouter.delete("/");

export default blogPostsRouter;
