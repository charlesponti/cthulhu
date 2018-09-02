import { Application } from "express";
import { Server } from "http";
import * as io from "socket.io";

export function connectIO(server: Server) {
  // Add socket to app and begin listening.
  const socket = io(server);

  // Emit initial message
  socket.on("connection", (s) => {
    return socket.emit("message", { message: "Cthulhu has you in her grips." });
  });

  return socket;
}
