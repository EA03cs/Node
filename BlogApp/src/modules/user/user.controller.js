import { Router } from "express";
import { getAllUsers, getUserById, searchUser, updateUser, deleteUser } from "./user.service.js";

const router = Router();
router.get('/getUsers', getAllUsers);
router.get('/user/:id/profile', getUserById);
router.get("/user/search", searchUser);
router.patch('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);
export default router;
