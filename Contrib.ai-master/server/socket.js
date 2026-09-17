import { Server } from "socket.io";
import { chatHandler } from "./sockets/chatSocket.js";
import { jobProgress, pendingJobs } from "./utils/jobStore.js";
import processRepo from "./processes/processRepo.js";
let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);
    chatHandler(socket);

    socket.on("join", (jobId) => {
      if (!jobId) return;

      socket.join(jobId);
      console.log(`Joined room: ${jobId}`);
      const state = jobProgress.get(jobId)
      if (state) {
        socket.emit("progress", state);
        if (state.progress === 100) {
          socket.emit("done");
        }
      }


    });

  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket not initialized!");
  }
  return io;
};