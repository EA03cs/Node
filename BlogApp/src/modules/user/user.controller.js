import { Router } from "express";
import { getAllUsers, getUserById, searchUser, updateUser, deleteUser } from "./user.service.js";

const router = Router();
router.get("/search", searchUser);
router.get('/', getAllUsers);
router.get('/getUsers', getAllUsers);
router.get('/:id/profile', getUserById);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);
export default router;
