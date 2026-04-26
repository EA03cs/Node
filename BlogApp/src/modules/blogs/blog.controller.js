import { Router } from "express";
import { getAllBlogs, createBlog } from "./blog.service.js";
const router = Router();
router.get('/getBlogs', getAllBlogs);
router.post('/createBlog', createBlog);
export default router;