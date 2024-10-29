import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  getBlogsByPagination,
  getRecentBlogs,
  getUniqueTags,
  searchBlogsByTags,
  updateBlog,
  updateIsShow,
} from "./blog.controller";
import adminVerify from "../../../middleware/admin.middlewere";

const blogRouter = express.Router();

blogRouter.post("/create", adminVerify, createBlog);
blogRouter.get("/getall", adminVerify, getAllBlogs);
blogRouter.get("/get-pagination/:page/:limit", getBlogsByPagination);
blogRouter.put("/update/:id", adminVerify, updateBlog);
blogRouter.put("/update-is-show/:id/:isShow", adminVerify, updateIsShow);
blogRouter.get("/get/:id", adminVerify, getBlogById);
blogRouter.get("/get-blog/:id", getBlogById);
blogRouter.delete("/delete/:id", adminVerify, deleteBlog);
blogRouter.get("/get-recent", getRecentBlogs);
blogRouter.get("/get-tag-list", getUniqueTags);
blogRouter.put("/serch-blogs-by-tags", searchBlogsByTags);

export default blogRouter;
