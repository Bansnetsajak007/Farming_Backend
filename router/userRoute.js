// package
import {Router} from "express";
import userController from "../controllers/userController.js";
const router = Router();

// routes
router.get("/conversation/:userId", userController.getConversation);
router.get("/:userId", userController.getUserInfo);
export default router;
