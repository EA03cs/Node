import { Router } from "express";
import { getAllUsers, getUserBytoken, searchUser, updateUser, deleteUser } from "./user.service.js";

const router = Router();
router.get("/search", searchUser);
router.get('/', getAllUsers);
router.get('/getUsers', getAllUsers);
router.get('/profile', getUserBytoken);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);
export default router;
