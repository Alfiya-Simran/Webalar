# 🧠 Real-Time Collaborative To-Do Board

A full-stack Kanban-style task board where multiple users can log in, create tasks, assign them, and collaborate in real time — similar to Trello but custom-built with real-time sync and smart logic.

---

## 🚀 Live Demo

🔗 Frontend: [your-frontend-url]  
🔗 Backend API: [your-backend-url]  
🎥 Demo Video: [your-video-link]

---

## 🔧 Tech Stack

- Frontend: **React**, Socket.IO, Axios, react-beautiful-dnd
- Backend: **Node.js**, Express, MongoDB (Mongoose), JWT Auth
- Real-time Sync: **Socket.IO**
- Hosting: Vercel (Frontend), Render (Backend)

---

## 📦 Features

- 👤 User Registration and Login (JWT)
- 🗂 Kanban Board with drag-and-drop (Todo, In Progress, Done)
- ⏱ Real-time Task Updates via WebSockets
- 🧠 **Smart Assign**: Auto-assigns task to user with fewest active tasks
- ⚔️ **Conflict Handling**: Shows merge options when two users edit the same task
- 📋 Activity Log Panel: Last 20 user actions, updates live
- 🎨 Custom UI with animations
- 📱 Fully Responsive Design

---

## 📜 Setup Instructions

```bash
# Backend
cd server
npm install
cp .env.example .env    # Add your MongoDB URI, JWT secret, etc.
npm run dev             # Or use nodemon

# Frontend
cd client
npm install
npm run dev
```
---

## Set your .env file: 

```bash
PORT=5000
MONGO_URI=your-mongodb-url
JWT_SECRET=your-jwt-key
CLIENT_URL=http://localhost:5173
```

---

## ⚙ Smart Assign Logic

**When "Smart Assign" is clicked:**

1. Fetch all tasks with status "Todo" or "In  rogress"
2. Count active tasks per user
3. Assign the task to the user with the least number of active tasks
4. Update DB and emit real-time update

---

## ⚔ Conflict Handling Logic

- Every task includes an updatedAt timestamp
- On update, client sends updatedAt field
- If server version is newer, backend sends 409 Conflict
- UI shows both versions and lets user:
    - ✅ Overwrite with own version
    - 🔄 Keep server version
    - ❌ Cancel