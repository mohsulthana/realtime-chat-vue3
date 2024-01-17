const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    cors: {
        origins: ["http://localhost:8080"],
    },
});

app.get("/", (req, res) => {
    res.send("<h1>Hey Socket.io</h1>");
});

io.on("connection", (socket) => {
    console.log("a user connected, id: " + socket.id);

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });

    socket.on("chat-message", async (message) => {
        socket.broadcast.emit("chat-message", message);
    });

    socket.on("joined", async (name) => {
        const data = {
            name,
            user_id: socket.id,
        };
        socket.broadcast.emit("new-user", data);
    });
});

http.listen(3000, () => {
    console.log("listening on *:3000");
});
