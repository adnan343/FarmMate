import express from 'express';

import {addFarm, deleteFarm, getFarms, updateFarm} from "../controllers/farm.controller.js";

const router = express.Router();

router.post('/', addFarm);

router.delete('/:id', deleteFarm);

router.get('/', getFarms);

router.put('/:id', updateFarm);

export default router;  ///api/farms

