import express from 'express'
import { registerNewUser, getUser } from '../Controllers/authController.js';
import { deleteUser, getAllUsers, updateUser } from '../Controllers/userController.js';

const router = express.Router();

router.post("/newUser", registerNewUser);
router.post("/signin", getUser);
router.post("/updateUser", updateUser);
router.get("/allUsers", getAllUsers);
router.delete("/deleteUser/:id", deleteUser);

export default router;