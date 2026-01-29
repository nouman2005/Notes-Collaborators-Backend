import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { getActivities } from "../controllers/activity.controller.js";
import { getActivitiesValidator } from "../validators/activity.validator.js";

const router = express.Router();

router.get(
  "/:noteId",
  protect,
  getActivitiesValidator,
  validate,
  getActivities,
);

export default router;
