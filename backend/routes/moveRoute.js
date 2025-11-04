import express from "express";
import moveController  from "../controllers/moveController.js";
const router = express.Router();

router.post("/makeMove", moveController);

export default router;
