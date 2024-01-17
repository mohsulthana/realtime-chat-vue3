import { io } from "socket.io-client";

class SocketioService {
    socket;
    constructor() {}

    setupSocketConnection() {
        this.socket = io("http://localhost:3000");
    }

    sendMessage(message) {
        this.socket.emit("chat-message", message);
    }

    addUser(username) {
        this.socket.emit("joined", username);
    }

    fetchJoinedUser() {
        this.socket.on("joined", (data) => {
            console.log(data);
        });
    }
}

export default new SocketioService();
