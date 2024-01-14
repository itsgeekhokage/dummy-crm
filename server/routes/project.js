import express from "express";
import { allProjects, appendAudios, multipleProject, newProject, replaceAudios, updateHeader, updateProject } from "../Controllers/projectController.js";

const router = express.Router();

router.get('/all', allProjects);
router.post("/new", newProject);
router.post("/multiple", multipleProject)
router.post("/files/replace", replaceAudios);
router.post("/files/append", appendAudios)
router.put("/update", updateProject);
router.post("/headers/update", updateHeader);

export default router;