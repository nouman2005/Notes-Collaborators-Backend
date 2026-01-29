import notes from "../config/db.js";
import crypto from "crypto";

export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const ownerId = req.user.id;

    const [result] = await notes.query(
      "INSERT INTO notes (owner_id, title, content) VALUES (?, ?, ?)",
      [ownerId, title, content],
    );

    await notes.query(
      "INSERT INTO activities (user_id, note_id, action) VALUES (?, ?, ?)",
      [ownerId, result.insertId, "created"],
    );

    res.status(201).json({ noteId: result.insertId });
  } catch (error) {
    console.error("CREATE NOTE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyNotes = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await notes.query(
      `SELECT DISTINCT n.* 
       FROM notes n
       LEFT JOIN collaborators c ON n.id = c.note_id
       WHERE n.owner_id = ? OR c.user_id = ?`,
      [userId, userId],
    );

    res.json(rows);
  } catch (error) {
    console.error("GET NOTES ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [rows] = await notes.query(
      `SELECT 
         n.id AS id,
         n.title,
         n.content
       FROM notes n
       LEFT JOIN collaborators c ON n.id = c.note_id
       WHERE n.id = ? AND (n.owner_id = ? OR c.user_id = ?)`,
      [id, userId, userId],
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("GET NOTE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { content, title } = req.body;

    await notes.query("UPDATE notes SET content = ?, title = ? WHERE id = ?", [
      content,
      title,
      noteId,
    ]);

    await notes.query(
      "INSERT INTO activities (user_id, note_id, action) VALUES (?, ?, ?)",
      [req.user.id, noteId, "updated"],
    );

    res.json({ message: "Note updated" });
  } catch (error) {
    console.error("UPDATE NOTE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const shareNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const token = crypto.randomBytes(16).toString("hex");

    await notes.query(
      "UPDATE notes SET is_public = true, share_token = ? WHERE id = ?",
      [token, noteId],
    );

    res.json({ shareLink: `/share/${token}` });
  } catch (error) {
    console.error("SHARE NOTE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getNoteByShareToken = async (req, res) => {
  try {
    const { token } = req.params;

    const [rows] = await notes.query(
      "SELECT title, content FROM notes WHERE share_token = ? AND is_public = true",
      [token],
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Invalid or expired link" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("SHARE TOKEN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
