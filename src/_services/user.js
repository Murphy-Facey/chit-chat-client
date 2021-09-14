const REQ_URL = "https://chit-chat-messaging.herokuapp.com";
// const REQ_URL = "https://ef6a-162-216-161-122.ngrok.io";

function options(method, args) {
  return {
    method,
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ ...args }),
  };
}

function register(firstName, lastName, username, password) {
  return fetch(
    `${REQ_URL}/user/register`,
    options("POST", { firstName, lastName, username, password })
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function login(username, password) {
  return fetch(`${REQ_URL}/user/login`, options("POST", { username, password }))
    .then(handleResponse)
    .then((user) => {

      if (user.token) {
        localStorage.setItem("user", JSON.stringify({ ...user }));
      }
      return user;
    });
}

function logout() {
  localStorage.removeItem("user");
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      const error = data;
      return Promise.reject(error);
    }
    return data;
  });
}

function getUsers(id, searchInput, pageNumber) {
  return fetch(`${REQ_URL}/user/`, options("POST", { id, searchInput, pageNumber }))
    .then(handleResponse)
    .then((users) => {
      return users;
    });
}

function addNewContact(userId, contactId) {
  return fetch(
    `${REQ_URL}/user/contacts/new`,
    options("POST", { user_id: userId, contact_id: contactId })
  )
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function fetchFriends(user_id) {
  return fetch(`${REQ_URL}/user/contacts/all`, options("POST", { user_id }))
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}

function createNewChat(userId, contactId) {
  return fetch(`${REQ_URL}/user/chat/new`, options("POST", { userId, contactId }))
    .then(handleResponse)
    .then(data => {
      return data;
    });
}

function fetchMessages(chatId) {
  return fetch(`${REQ_URL}/user/message/all`, options("POST", { chatId }))
   .then(handleResponse)
   .then(data => {
     return data;
   })
}

export default {
  register,
  login,
  logout,
  getUsers,
  addNewContact,
  fetchFriends,
  createNewChat,
  fetchMessages
};
