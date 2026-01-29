import { body } from "express-validator";

export const addCollaboratorValidator = [
  body("noteId")
    .notEmpty()
    .withMessage("noteId is required")
    .isInt()
    .withMessage("noteId must be an integer"),

  body("userId")
    .notEmpty()
    .withMessage("userId is required")
    .isInt()
    .withMessage("userId must be an integer"),

  body("permission")
    .notEmpty()
    .withMessage("permission is required")
    .isIn(["editor", "viewer"])
    .withMessage("permission must be editor or viewer"),
];
