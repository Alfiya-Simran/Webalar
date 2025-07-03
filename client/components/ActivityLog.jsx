import { useEffect, useState } from "react";
import axios from "axios";
import { useSocket } from "../content/SocketContext";

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const socket = useSocket();

  const fetchLogs = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/tasks/logs`,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to load logs");
    }
  };

  useEffect(() => {
    fetchLogs();

    if (!socket) return;

    const updateLog = () => fetchLogs();

    socket.on("taskCreated", updateLog);
    socket.on("taskUpdated", updateLog);
    socket.on("taskDeleted", updateLog);

    return () => {
      socket.off("taskCreated", updateLog);
      socket.off("taskUpdated", updateLog);
      socket.off("taskDeleted", updateLog);
    };
  }, [socket]);

  return (
    <div style={{ width: "300px", padding: "1rem", background: "#fafafa", borderLeft: "1px solid #ddd", overflowY: "auto", height: "100vh" }}>
      <h3>Activity Log</h3>
      <ul>
        {logs.map((log) => (
          <li key={log._id}>
            <div style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
              <strong>{log.performedBy?.name}</strong>: {log.action}
              <br />
              <small>{new Date(log.timestamp).toLocaleString()}</small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
