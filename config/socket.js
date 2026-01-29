const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Connected:", socket.id);

    socket.on("join-note", (noteId) => {
      socket.join(noteId);
    });

    socket.on("note-update", ({ noteId, content }) => {
      // 🔥 send to OTHERS, not sender
      socket.to(noteId).emit("receive-update", content);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.id);
    });
  });
};

export default socketHandler;
