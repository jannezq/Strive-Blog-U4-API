import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data"); // this is the path to data under the src root.
const authorsJSONPath = join(dataFolderPath, "authors.json");
const blogPostJSONPath = join(dataFolderPath, "blogPosts.json");
const authorsPublicFolderPath = join(process.cwd(), "./public/img/authors");

export const getAuthors = () => readJSON(authorsJSONPath);
export const getBlogPosts = () => readJSON(blogPostJSONPath);

export const writeBlogPost = (blogPostArray) =>
  writeJSON(blogPostJSONPath, blogPostArray);
export const writeAuthors = (authorsArray) => (authorsJSONPath, authorsArray);

export const saveAuthorsAvatar = (fileName, fileContentAsBuffer) =>
  writeFile(join(authorsPublicFolderPath, fileName), fileContentAsBuffer);
