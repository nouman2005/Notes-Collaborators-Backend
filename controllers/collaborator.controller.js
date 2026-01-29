import collaborators from "../config/db.js";

export const addCollaborator = async (req, res) => {
  const { userId, permission } = req.body;

  const [existing] = await collaborators.query(
    "SELECT id FROM collaborators WHERE note_id = ? AND user_id = ?",
    [req.params.noteId, userId],
  );

  if (existing.length) {
    return res.status(400).json({ message: "User already collaborator" });
  }

  await collaborators.query(
    "INSERT INTO collaborators (note_id, user_id, permission) VALUES (?, ?, ?)",
    [req.params.noteId, userId, permission],
  );

  res.json({ message: "Collaborator added" });
};
