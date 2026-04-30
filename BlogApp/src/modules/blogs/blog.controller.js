import { Router } from "express";
import { getAllBlogs, createBlog } from "./blog.service.js";
const router = Router();
router.get('/', getAllBlogs);
router.get('/getBlogs', getAllBlogs);
router.post('/', createBlog);
router.post('/createBlog', createBlog);
export default router;
