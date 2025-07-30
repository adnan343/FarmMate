import express from 'express';
import {createUser, getUsers, deleteUser, updateUser, loginUser} from "../controllers/user.controller.js";

const router = express.Router();

router.post('/', createUser);

router.delete('/:id', deleteUser);
//
router.get('/', getUsers);
//
router.put('/:id', updateUser);

router.post('/login', loginUser)

export default router;  ///api/farms