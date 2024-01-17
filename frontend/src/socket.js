import { io } from "socket.io-client";

class SocketioService {
    socket;
    info = [];
    listeners = [];

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
        this.socket.on("new-user", (data) => {
            this.info.push({
                username: data.name,
                id: data.user_id,
            });

            this.notifyListeners();

            setTimeout(() => {
                this.info = [];
                this.notifyListeners();
            }, 3000);
        });
    }

    subscribe(callback) {
        this.listeners.push(callback);
    }

    notifyListeners() {
        this.listeners.forEach((callback) => callback(this.info));
    }
}

export default new SocketioService();
