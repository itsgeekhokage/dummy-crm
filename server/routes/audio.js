import express from "express"
import { updateAudio } from "../Controllers/audioController.js";

const router = express.Router();

router.post('/update', updateAudio);

export default router;