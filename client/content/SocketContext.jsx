import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [socketReady, setSocketReady] = useState(false);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_BACKEND_URL, {
      transports: ["websocket", "polling"], // ✅ Reliable fallback
      withCredentials: true,                // ✅ Enables cookies if needed
    });

    socketRef.current.on("connect", () => {
      console.log("🟢 Socket connected:", socketRef.current.id);
      setSocketReady(true);
    });

    return () => {
      socketRef.current.disconnect();
      console.log("🔴 Socket disconnected");
    };
  }, []);

  return (
    <SocketContext.Provider value={socketReady ? socketRef.current : null}>
      {children}
    </SocketContext.Provider>
  );
};
