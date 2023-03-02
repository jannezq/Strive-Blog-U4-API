// *********************************************** BLOGPOSTS RELATED ENDPOINTS ******************************************

/* ************************************************* BLOGPOSTS CRUD ENDPOINTS *******************************************
1. CREATE --> POST http://localhost:300/blogPost/ (+ body)
2. READ --> GET http://localhost:300/blogPosts/ (+ optional query search params)
3. READ (single blogPost) --> GET http://localhost:300/blogPosts/:blogPostId
4. UPDATE (single blogPost) --> PUT http://localhost:300/blogPosts/:blogPostId (+ body)
5. DELETE (single blogPost) --> DELETE http://localhost:300/blogPosts/:blogPostId
*/

import Express from "express";
import { getBlogPosts, writeBlogPost } from "../../library/fs-tools.js";
import uniqid from "uniqid";
// import uiavatars from "ui-avatars";

const blogPostsRouter = Express.Router();

blogPostsRouter.post("/", async (req, res, next) => {
  try {
    const newBlogPost = {
      ...req.body,
      author: {
        ...req.body.author,
        avatar: `https://ui-avatars.com/api/?name=${req.body.author.name}`,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      id: uniqid(),
    };

    const blogPostsArray = await getBlogPosts();
    blogPostsArray.push(newBlogPost);
    await writeBlogPost(blogPostsArray);

    res.status(201).send({ id: newBlogPost.id });
  } catch (error) {
    next(500).send({ message: error.message });
  }
});

//get all blogPosts by title
blogPostsRouter.get("/", async (req, res, next) => {
  const blogPosts = await getBlogPosts();
  if (req.query && req.query.title) {
    const blogPostTitleSearch = blogPosts.filter(
      (blogTitle) => blogTitle.title === req.query.title
    );
    res.send(blogPostTitleSearch);
  } else {
    res.send(blogPosts);
  }
});

blogPostsRouter.get("/:blogPostId", async (req, res, next) => {
  try {
    const blogPostArray = await getBlogPosts();

    const foundBlogPost = blogPostArray.find(
      (blogPost) => blogPost.id === req.params.blogPostId
    );
    if (foundBlogPost) {
      res.send(foundBlogPost);
    } else {
      next(
        createHttpError(404, `Book with id ${req.params.blogPostId} not found!`)
      ); // this jumps to the error handlers
    }
  } catch (error) {
    next(error); // This error does not have a status code, it should trigger a 500
  }
});

blogPostsRouter.put("/:blogPostId", async (req, res, next) => {
  try {
    const blogsArray = await getBlogPosts();

    const index = blogsArray.findIndex(
      (blogPost) => blogPost.id === req.params.blogPostId
    );
    if (index !== -1) {
      const oldBlog = blogsArray[index];

      const updatedBlog = { ...oldBlog, ...req.body, updatedAt: new Date() };

      blogsArray[index] = updatedBlog;

      await writeBlogPost(blogsArray);

      res.send(updatedBlog);
    } else {
      next(createHttpError(404, `Blog cannot be edited!`)); //
    }
  } catch (error) {
    next(error);
  }
});

blogPostsRouter.delete("/:blogPostId", async (req, res, next) => {
  try {
    const blogsArrays = await getBlogPosts();
    const remainingBlogPosts = blogsArrays.filter(
      (b) => b.id !== req.params.blogPostId
    );
    if (blogsArrays.length !== remainingBlogPosts.length) {
      await writeBlogPost(remainingBlogPosts);
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Blog Post with the id (${req.params.blogPostId}) not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default blogPostsRouter;
