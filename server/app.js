import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';

const PORT = 3000;

const app = express();
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.SITE_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Socket Middlewares
// io.use((socket, next) => {});

io.on("connection", (socket) => {
    console.log("A User Connected; User-ID:", socket.id);

    // Individual socket ko jayega message
    // socket.emit("Welcome", `Welcome to the Server ${socket.id}`);

    // Jo socket hai usko chodke sbko message jayega
    // socket.broadcast.emit("Welcome", `${socket.id} joined the server`);

    socket.on("message", (data) => {
        console.log(data);
        if(data.room === "all")
        socket.broadcast.emit("receive-message", data.message);
        else
        io.to(data.room).emit("receive-message", data.message);
    });

    socket.on("join-room", (room) => {
        socket.join(room);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected:", socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});