<script setup lang="ts">
    import { ref, watch } from "vue";
    import SocketioService from "../socket.js";

    interface User {
        username: string;
        id: string;
    }

    interface Message {
        message: string;
        type: number;
        user: string;
    }

    const message = ref("");

    const joinedUsers = ref<User[]>([]);

    const updateJoinedUsers = (newInfo: User[]) => {
        joinedUsers.value.splice(0, joinedUsers.value.length, ...newInfo);
    };

    SocketioService.setupSocketConnection();
    SocketioService.subscribe(updateJoinedUsers);
    SocketioService.fetchJoinedUser();

    const messages = ref<Message[]>([]);

    SocketioService.socket.on("chat-message", (message: Message[]) => {
        messages.value = message;
    });

    const user = ref("");

    const sendMessage = (args: KeyboardEvent) => {
        const input = args.target as HTMLInputElement;
        let msg = input.value;

        messages.value.push({
            message: msg,
            type: 0,
            user: user.value,
        });
        SocketioService.sendMessage(messages.value);
        message.value = "";
    };

    const login = (args: KeyboardEvent) => {
        const input = args.target as HTMLInputElement;
        let name = input.value;
        user.value = name;
        SocketioService.addUser(user.value);
    };

    SocketioService.fetchJoinedUser();

    const connections = ref<number>(0);

    SocketioService.socket.on("connections", (data: number) => {
        connections.value = data;
    });

    const typing = ref<boolean | string>(false);

    SocketioService.socket.on("typing", (data: boolean | string) => {
        typing.value = data;
    });

    SocketioService.socket.on("stopTyping", () => {
        typing.value = false;
    });

    watch(message, (value) => {
        value
            ? SocketioService.socket.emit("typing", user.value)
            : SocketioService.socket.emit("stopTyping");
    });
</script>

<template>
    <div>
        <v-app>
            <v-container>
                <v-row v-if="!user">
                    <v-col>
                        <h1 class="h1 mb-3">Type your name to join the chat</h1>
                        <v-text-field
                            label="Type your name"
                            type="text"
                            no-details
                            outlined
                            append-outer-icon="send"
                            hide-details
                            @keyup.enter="login"
                            @click:append-outer="login"
                        />
                    </v-col>
                </v-row>
                <v-row v-else>
                    <v-col cols="auto" class="flex-grow-1 flex-shrink-0">
                        <v-card
                            flat
                            class="d-flex flex-column"
                            style="background-color: #f5f5f5; height: 800px"
                        >
                            <v-toolbar color="white">
                                <v-toolbar-title class="text-right">
                                    <v-icon icon="home"></v-icon> {{ user }}
                                </v-toolbar-title>
                            </v-toolbar>
                            <v-card-text
                                class="flex-grow-1 overflow-y-auto h-50 flex-shrink-1"
                            >
                                <small v-if="typing"
                                    >{{ typing }} is typing</small
                                >
                                <template v-if="messages.length < 1">
                                    <h3 class="text-center my-3">
                                        No converstation has been made. Type
                                        your message to start chatting!
                                    </h3>
                                </template>
                                <template v-else>
                                    <template v-for="msg in messages">
                                        <div
                                            :class="{
                                                'd-flex flex-row-reverse':
                                                    msg.user === user,
                                            }"
                                        >
                                            <v-menu offset-y>
                                                <template
                                                    v-slot:activator="{ on }"
                                                >
                                                    <v-hover
                                                        v-slot:default="{
                                                            hover,
                                                        }"
                                                    >
                                                        <v-chip
                                                            :color="
                                                                msg.user != user
                                                                    ? 'default'
                                                                    : 'primary'
                                                            "
                                                            dark
                                                            style="
                                                                height: auto;
                                                                white-space: normal;
                                                            "
                                                            class="pa-4 mb-2"
                                                            v-on="on"
                                                        >
                                                            {{ msg.message }}
                                                            <sub
                                                                class="ml-2"
                                                                style="
                                                                    font-size: 0.5rem;
                                                                "
                                                            >
                                                                {{
                                                                    msg.user ===
                                                                    user
                                                                        ? "Me"
                                                                        : msg.user
                                                                }}
                                                            </sub>
                                                            <v-icon
                                                                v-if="hover"
                                                                small
                                                            >
                                                                expand_more
                                                            </v-icon>
                                                        </v-chip>
                                                    </v-hover>
                                                </template>
                                                <v-list>
                                                    <v-list-item>
                                                        <v-list-item-title
                                                            >delete</v-list-item-title
                                                        >
                                                    </v-list-item>
                                                </v-list>
                                            </v-menu>
                                        </div>
                                    </template>
                                </template>
                            </v-card-text>
                            <v-card-actions>
                                <v-text-field
                                    label="Type a message"
                                    type="text"
                                    no-details
                                    outlined
                                    append-inner-icon="send"
                                    hide-details
                                    v-model="message"
                                    @keyup.enter="sendMessage"
                                    @click:append-outer="sendMessage"
                                    clearable
                                />
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-app>
    </div>
</template>

<style scoped></style>
