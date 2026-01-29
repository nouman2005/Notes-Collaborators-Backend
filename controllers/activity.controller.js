import activities from "../config/db.js";

export const getActivities = async (req, res) => {
  const { noteId } = req.params;

  const [logs] = await activities.query(
    `SELECT a.*, u.name FROM activities a
     JOIN users u ON a.user_id=u.id
     WHERE note_id=? ORDER BY created_at DESC`,
    [noteId],
  );

  res.json(logs);
};
