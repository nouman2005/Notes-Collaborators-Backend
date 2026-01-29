import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import { registerValidator } from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", login);

export default router;
