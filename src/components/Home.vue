<template>
  <div class="home">
    <div class="home_container">
      <div class="home_left_side">
        <div class="user_section">
          <div class="user">
            <div class="user_image">M</div>
            <div class="user_info">
              <p class="name">{{ currentUser.firstName}} {{ currentUser.lastName }}</p>
              <p class="username">{{ currentUser.username }}</p>
            </div>
          </div>
          <div class="settings">
            <p class="user_status">Online</p>
            <button class="logout" @click="logoutEvent">
              <font-awesome-icon :icon="logoutIcon" class="icon" />
              <span>Logout</span>
            </button>
            <button class="theme" @click="toggleTheme">
              <font-awesome-icon
                :icon="getIsDarkTheme ? lightThemeIcon : darkThemeIcon"
                class="icon"
              />
              <span>{{ this.getIsDarkTheme ? "Light" : "Dark" }}</span>
            </button>
          </div>
        </div>
        <div class="contacts_section">
          <div class="search_contacts">
            <font-awesome-icon :icon="searchIcon" class="search-icon" />
            <input
              type="text"
              placeholder="Search contacts"
              v-model="friendName"
            />
          </div>
          <div class="contact_list">
            <contact
              v-for="contact in this.getFriendsBy()"
              :key="contact._id"
              :contact="contact"
            />
          </div>
        </div>
      </div>
      <div class="home_right_side">
        <div class="search_new_contacts">
          <font-awesome-icon :icon="searchIcon" class="search-icon" />
          <input
            type="text"
            placeholder="Search New Contact"
            v-model="searchUserInput"
          />
          <button class="search_btns" @click="this.getUsers">Search</button>
          <contact-modal v-if="showOtherUserModal" />
        </div>
        <div class="chat_area" :class="{ blur: showOtherUserModal }">
          <div class="chat" v-chat-scroll="{ enable: false }">
            <message
              v-for="(message, index) in this.getMessages"
              :key="index"
              :message="message"
            />
          </div>
          <emoji-picker
            :setShowEmojiPicker="this.setShowEmojiPicker"
            v-if="isPickerActive"
            v-on:selectedEmoji="addEmojiToMessage"
          />
          <div class="message_input" v-if="!(chat.chatId == undefined)">
            <textarea
              id="message_text"
              placeholder="Enter message here"
              v-model="message"
              @keypress="sendMessageEvent"
            ></textarea>
            <div class="emoji_btn">
              <font-awesome-icon
                :icon="emojiIcon"
                class="emoji-icon"
                @click="setShowEmojiPicker(true)"
              />
            </div>
            <button @click="sendMessage">
              <font-awesome-icon :icon="sendIcon" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faSmile } from "@fortawesome/free-regular-svg-icons";
import {
  faSearch,
  faPaperPlane,
  faSun,
  faMoon,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";


import { mapGetters, mapActions, mapMutations } from "vuex";

import Contact from "./Contact.vue";
import ContactModal from "./ContactModal.vue";
import Message from "./Message.vue";
import EmojiPicker from "./EmojiPicker.vue";

import { toggleColorTheme } from "../helper/theme";

export default {
  name: "Home",
  data() {
    return {
      searchIcon: faSearch,
      emojiIcon: faSmile,
      sendIcon: faPaperPlane,
      lightThemeIcon: faSun,
      darkThemeIcon: faMoon,
      logoutIcon: faSignOutAlt,
      searchUserInput: "",
      message: "",
      friendName: "",
      isPickerActive: false,
      currentUser: {}
    };
  },
  components: {
    FontAwesomeIcon,
    Contact,
    ContactModal,
    Message,
    EmojiPicker,
    // VEmojiPicker,
    // DiscordPicker
  },
  sockets: {
    onlineOthers(data) {
      this.$store.commit("user/setOnlineFriends", data);
    },
    sendMessage(data) {
      this.$store.commit("user/addNewMessage", {
        dateSent: new Date(data.dateSent),
        ...data,
      });
      this.scrollToEnd();
    },
    changeLatestMessage(data) {
      console.log(data);
    },
    setLatestMessage({ friendId, message }) {
      this.$store.commit("user/setLatestMessage", {
        friendId: friendId,
        message: {
          dateSent: new Date(message.dateSent),
          message: message.message,
        },
      });
    },
  },
  computed: {
    ...mapGetters("user", [
      "getMessages",
      "getChat",
      "getFriends",
      "getOtherUsers",
      "getPageNumber",
      "getIsDarkTheme"
    ]),
    chat() {
      return this.getChat;
    },
    showOtherUserModal() {
      return this.getOtherUsers.length != 0;
    },
  },
  methods: {
    ...mapMutations("user", ["addNewMessage", "setChat", "setLatestMessage", "changeColorTheme"]),
    ...mapActions("user", ["fetchOtherUsers", "fetchFriends", "fetchMessages", "logout"]),
    getFriendsBy() {
      if (this.friendName) {
        return this.getFriends.filter(({ firstName, lastName }) =>
          firstName.toLowerCase().includes(this.friendName.toLowerCase()) || lastName.toLowerCase().includes(this.friendName.toLowerCase())
        );
      }
      return this.getFriends
        .sort((a, b) => {
          if (a.latestMessage.dateSent != "" && b.latestMessage.dateSent != "") {
            let dateSentA = new Date(a.latestMessage.dateSent);
            let dateSentB = new Date(b.latestMessage.dateSent);

            if (dateSentA.getTime() < dateSentB.getTime()) return 1;
            if (dateSentA.getTime() > dateSentB.getTime()) return -1;
          }
          return 0;
        });
    },
    toggleTheme() {
      this.changeColorTheme();
      toggleColorTheme(this.getIsDarkTheme);
    },
    getUsers() {
      this.fetchOtherUsers({
        searchInput: this.searchUserInput,
        pageNumber: this.getPageNumber,
      });
    },
    sendMessage() {
      let { chatId, friendId } = this.getChat;
      let { message, currentUser: { id }} = this;

      if(!message) return;

      let newMessage = { message, dateSent: new Date(), userId: id, chatId };

      this.addNewMessage(newMessage);
      this.setLatestMessage({
        friendId,
        message: { message: newMessage.message, dateSent: newMessage.dateSent },
      });

      this.$socket.emit("message", newMessage);
      this.$socket.emit("updateLatestMessage", {
        friendId,
        message: { message: newMessage.message, dateSent: newMessage.dateSent },
      });

      this.message = "";
    },
    sendMessageEvent(event) {
      if (event.shiftKey && event.keyCode == 13) {
        let messageInput = document.querySelector("#message_text");
        messageInput.scrollTop = messageInput.scrollHeight + 100;
      }

      if (event.keyCode == 13 && !event.shiftKey) {
        event.preventDefault();
        this.sendMessage();
      }
    },
    setShowEmojiPicker(show) {
      this.isPickerActive = show;
    },
    addEmojiToMessage(emoji) {
      let index = document.querySelector("textarea").selectionStart;
      console.log(index);

      this.message =
        this.message.slice(0, index) + emoji + this.message.slice(index);
      document.querySelector("textarea").selectionStart = index;

      console.log(document.querySelector("textarea").selectionStart);
    },
    scrollToEnd() {
      const container = document.querySelector(".chat");
      container.scrollTop = container.scrollHeight;
    },
    logoutEvent() {
      this.$socket.emit("offline");
      this.setChat({});
      this.logout();
    },
  },
  watch: {
    chat({ chatId }) {
      this.$socket.emit("joinChat", chatId);
      this.fetchMessages(chatId);
    },
  },
  mounted() {
    this.currentUser = JSON.parse(localStorage.getItem("user"));

    this.fetchFriends(this.currentUser.id);
    this.$socket.emit(
      "online",
      this.currentUser.id
    );
  },
};
</script>

<style lang="scss" scoped>
.search-icon {
  position: absolute;
  top: 50%;
  left: 8px;
  transform: translateY(-50%);

  font-size: 16px;

  color: var(--other-clr-1);
}

.search_btns {
  height: 22px;

  position: absolute;
  top: 50%;
  right: 7px;
  transform: translateY(-50%);

  padding: 0 6px;

  background: var(--accent-clr);
  border: none;
  border-radius: 5px;

  font-family: $montserrat;
  font-weight: map-get($font_weights, "medium");
  font-size: 12px;
  color: var(--other-clr-2);
}

.home {
  width: 100%;
  height: 100%;

  display: grid;
  place-items: center;

  padding: 30px 0;

  .home_container {
    width: min(1000px, 90%);
    height: 100%;

    display: flex;

    overflow: hidden;

    .home_left_side {
      width: 30%;

      display: flex;
      flex-direction: column;

      .user_section {
        position: relative;

        display: flex;
        flex-direction: column;

        padding: 10px;

        background: var(--primary-clr);

        .user {
          display: flex;
          align-items: center;
          // justify-content: f;

          .user_image {
            width: 40px;
            height: 40px;

            display: grid;
            place-items: center;

            background: chocolate;
            border: 2px solid white;
            border-radius: 10px;

            font-family: $montserrat;
            font-weight: bold;
          }

          .user_info {
            margin-left: 10px;
            font-family: $montserrat;

            p:nth-child(1) {
              font-weight: map-get($font_weights, "semi_bold");
              color: var(--other-clr-2);
            }

            p:nth-child(2) {
              position: relative;
              bottom: 1px;

              font-size: 14px;
              font-style: italic;
              color: var(--other-clr-1);
            }
          }
        }

        .settings {
          height: 30px;

          display: flex;
          justify-content: space-between;

          margin-top: 15px;

          .user_status {
            display: flex;
            align-items: center;

            position: relative;

            padding-left: 20px;
            padding-right: 5px;

            background: #70e00031;
            border: 1px solid $green_lizard;
            border-radius: 5px;

            font-family: $montserrat;
            font-weight: map-get($font_weights, "medium");
            font-size: 14px;
            color: $green_lizard;

            &::before {
              content: "";

              width: 6px;
              height: 6px;

              position: absolute;
              top: 50%;
              left: 7px;
              transform: translateY(-50%);

              background: $green_lizard;
              border-radius: 5px;
            }

            &:hover {
              background: var(--background-clr);
            }
          }

          .logout,
          .theme {
            padding: 0 6px;

            background: var(--secondary-clr);
            border: 1.5px solid transparent;
            border-radius: 5px;

            font-family: $montserrat;
            font-weight: map-get($font_weights, "medium");
            color: var(--other-clr-1);

            .icon {
              margin-right: 5px;
            }

            &:hover {
              background: var(--background-clr);
            }

            &:focus {
              border-color: var(--other-clr-2);
            }
          }
        }
      }

      .contacts_section {
        flex-grow: 1;
        overflow: hidden;

        margin-top: 20px;
        padding: 10px;
        background: var(--primary-clr);

        .search_contacts {
          position: relative;

          margin-bottom: 15px;

          input {
            width: 100%;

            padding: 10px 0;

            background: transparent;
            border: 1px solid var(--accent-clr);
            border-radius: 5px;
            outline: none;

            color: var(--other-clr-1);
            text-indent: 30px;

            &:hover {
              background: var(--background-clr);
            }

            &:focus {
              background: var(--background-clr);
              border-color: var(--secondary-clr);
            }
          }
        }

        .contact_list {
          height: calc(100% - 54.2px);
          overflow-y: scroll;
          scrollbar-width: none;

          font-family: sans-serif;
        }
      }
    }
  }

  .home_right_side {
    width: 70%;

    display: flex;
    flex-direction: column;

    overflow: hidden;

    padding: 0px 15px;

    .search_new_contacts {
      position: relative;

      input {
        width: 100%;

        padding: 10px 0;

        background: var(--background-clr);
        border: 1px solid var(--primary-clr);
        border-radius: 5px;
        outline: none;

        text-indent: 30px;
        color: var(--other-clr-1);

        &:hover {
          background: var(--primary-clr);
        }

        &:focus {
          background: var(--primary-clr);
          border-color: var(--accent-clr);
        }
      }
    }

    .chat_area {
      flex-grow: 1;
      margin-top: 20px;

      display: flex;
      flex-direction: column;

      background: var(--primary-clr);
      position: relative;

      overflow: hidden;

      .chat {
        flex-grow: 1;

        display: flex;
        flex-direction: column;

        padding: 10px;

        overflow-y: auto;
        overflow-x: hidden;
      }

      .message_input {
        width: 96%;

        display: flex;
        justify-content: space-between;

        position: relative;
        left: 50%;
        transform: translateX(-50%);

        textarea {
          width: 100%;
          height: 37.6px;

          padding: 8px 106px 8px 10px;

          background: var(--secondary-clr);
          border: 2px solid transparent;
          outline: none;

          // overflow: hidden;
          resize: none;

          font-family: $montserrat;
          font-size: 14px;

          &:hover,
          &:focus {
            border-color: var(--accent-clr);
          }

          &::-webkit-scrollbar {
            appearance: none;
          }
        }

        button {
          width: 60px;

          display: flex;
          justify-content: space-evenly;

          position: absolute;
          top: 50%;
          right: 5px;
          transform: translateY(-50%);

          padding: 4px 0px;

          background: var(--accent-clr);
          border: none;
          border-radius: 5px;

          font-family: $montserrat;
          font-weight: map-get($font_weights, "semi_bold");
          font-size: 13px;

          color: var(--other-clr-2);
        }

        .emoji_btn {
          position: absolute;
          top: 50%;
          right: 70px;
          transform: translateY(-50%);

          display: grid;
          place-items: center;

          border-radius: 4px;

          color: var(--other-clr-2);

          padding: 4px;
          // background: var(--other-clr-2);

          &:hover {
            background: var(--other-clr-2);
            color: var(--background-clr);
          }
        }
      }

      &.blur > * {
        filter: blur(3px);
        pointer-events: none;
      }
    }
  }
}
</style>