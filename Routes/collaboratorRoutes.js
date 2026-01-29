import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { addCollaborator } from "../controllers/collaborator.controller.js";
import { addCollaboratorValidator } from "../validators/collaborator.validator.js";

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles("admin", "editor"),
  addCollaboratorValidator,
  validate,
  addCollaborator,
);

export default router;
