import express from 'express';
import { createUser, deleteUser, getUserById, getUsers, loginUser, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post('/', createUser);

router.delete('/:id', deleteUser);
//
router.get('/', getUsers);
//
router.put('/:id', updateUser);

router.post('/login', loginUser)

router.get('/:id', getUserById);

export default router;  ///api/farms