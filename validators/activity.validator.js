import { param } from "express-validator";

export const getActivitiesValidator = [
  param("noteId")
    .notEmpty()
    .withMessage("noteId is required")
    .isInt()
    .withMessage("noteId must be a valid integer"),
];
