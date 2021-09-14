import { createApp } from "vue";
import store from "./store";
import router from "./router";
import vClickOutside from "click-outside-vue3";

import VueSocketIO from 'vue-3-socket.io';
import { io } from "socket.io-client";
import VueChatScroll from "vue-chat-scroll";

import App from "./App.vue";

const socketIO = io("http://localhost:8000")
// const socketIO = io("https://ef6a-162-216-161-122.ngrok.io")

createApp(App)
  .use(store)
  .use(router)
  .use(vClickOutside)
  .use(VueChatScroll)
  .use(new VueSocketIO({ connection: socketIO}))
  .mount("#app");
