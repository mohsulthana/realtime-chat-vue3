<script setup lang="ts">
    import { ref } from "vue";
    import SocketioService from "./socket.js";

    SocketioService.setupSocketConnection();

    SocketioService.fetchJoinedUser();

    interface Message {
        message: string;
        type: number;
        user: string;
    }

    const messages = ref<Message[]>([]);

    const sendMessage = (message: KeyboardEvent) => {
        let msg = message.target.value;

        messages.value.push({
            message: msg,
            type: 1,
            user: "hello",
        });
        SocketioService.sendMessage(msg);
    };

    const user = ref("");

    const login = (message: KeyboardEvent) => {
        let name = message.target.value;
        user.value = name;
    };
</script>

<template>
    <div>
        <v-app>
            <v-container>
                <v-row>
                    <v-col>
                        <h1>{{ user }}</h1>
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
                <v-row>
                    <v-col cols="auto" class="flex-grow-1 flex-shrink-0">
                        <v-card flat class="d-flex flex-column fill-height">
                            <v-card-title>
                                {{ user || "John Doe" }}
                            </v-card-title>
                            <v-card-text class="flex-grow-1 overflow-y-auto">
                                {{ messages }}
                                <template v-for="(msg, i) in messages">
                                    <div
                                        :class="{
                                            'd-flex flex-row-reverse':
                                                msg.message,
                                        }"
                                    >
                                        <v-menu offset-y>
                                            <template v-slot:activator="{ on }">
                                                <v-hover
                                                    v-slot:default="{ hover }"
                                                >
                                                    <v-chip
                                                        :color="
                                                            msg.message
                                                                ? 'primary'
                                                                : 'secondary'
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
                                                            {{ msg.user }}
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
                            </v-card-text>
                            <v-card-text class="flex-shrink-1">
                                <v-text-field
                                    label="Type a message"
                                    type="text"
                                    no-details
                                    outlined
                                    append-outer-icon="send"
                                    hide-details
                                    @keyup.enter="sendMessage"
                                    @click:append-outer="sendMessage"
                                />
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-app>
    </div>
</template>

<style scoped></style>
