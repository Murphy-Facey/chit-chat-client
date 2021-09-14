import userService from "../_services/user";
import router from "../router";

export const user = {
  namespaced: true,
  state: {
    otherUsers: [],
    friends: [],
    messages: [],
    selectedChat: {},
    pageNumber: 1,
    usersCount: 0,
    searchInput: "",
    dummy: "",
  },
  getters: {
    getOtherUsers(state) {
      return state.otherUsers;
    },
    getFriends(state) {
      return state.friends;
    },
    getChat(state) {
      return state.selectedChat;
    },
    getMessages(state) {
      return state.messages;
    },
    getUsersCount(state) {
      return state.usersCount;
    },
    getPageNumber(state) {
      return state.pageNumber;
    },
    getSearchInput(state) {
      return state.searchInput;
    },
  },
  mutations: {
    setOtherUsers(state, otherUsers) {
      state.otherUsers = otherUsers;
    },
    setFriends(state, friends) {
      state.friends = friends;
    },
    setOnlineFriends(state, friend_ids) {
      state.friends = state.friends.map((friend) => friend_ids.includes(friend._id) ? { ...friend, isOnline: !friend.isOnline } : friend)
    },
    setChat(state, chatInfo) {
      state.selectedChat = chatInfo;
    },
    addNewMessage(state, message) {
      state.messages = [...state.messages, message];
    },
    setMessages(state, messages) {
      state.messages = messages;
    },
    setLatestMessage(state, { friendId, message }) {
      state.friends = state.friends.map((friend) => friend._id == friendId ? { ...friend, latestMessage: message } : friend);
    },
    changePageNumber(state, number) {
      state.pageNumber += number;
    },
    setUsersCount(state, count) {
      state.usersCount = count;
    },
    setSearchInput(state, searchInput) {
      state.searchInput = searchInput;
    },
  },
  actions: {
    fetchOtherUsers({ commit, rootGetters }, { searchInput, pageNumber }) {
      userService
        .getUsers(
          rootGetters["authentication/getUserInfo"].id,
          searchInput,
          pageNumber
        )
        .then(({ users, count, searchInput }) => {
          commit("setOtherUsers", users);
          commit("setUsersCount", count);
          commit("setSearchInput", searchInput);
        });
    },
    addNewContact(_, { userId, contactId }) {
      userService.addNewContact(userId, contactId).then((some) => {
        console.log(some);
        // commit("dummyMutation");
      });
    },
    fetchFriends({ commit }, userId) {
      userService.fetchFriends(userId).then((friends) => {
        commit("setFriends", friends);
      });
    },
    createNewChat({ commit }, { userId, contactId }) {
      userService.createNewChat(userId, contactId).then(({ chatId }) => {
        commit("setChat", { chatId, friendId: contactId });
      });
    },
    fetchMessages({ commit }, chatId) {
      userService.fetchMessages(chatId).then((messages) => {
        commit("setMessages", messages);
      });
    },
    logout() {
      userService.logout();
      router.push("/login");
    },
  },
};
