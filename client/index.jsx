import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./content/AuthContext.jsx";  // ✅ Must match actual file path
import { SocketProvider } from "./content/SocketContext.jsx";  // ✅ Same here

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <SocketProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SocketProvider>
  </AuthProvider>
);

