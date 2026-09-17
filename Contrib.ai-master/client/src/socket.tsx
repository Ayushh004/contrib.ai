import { io } from "socket.io-client";

const URL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || "http://localhost:8080";

export const socket = io(URL, {
  autoConnect: false, 
  transports: ["websocket"],
});