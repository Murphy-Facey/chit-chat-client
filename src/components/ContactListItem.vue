<template>
  <div class="contact_list_item">
    <div class="contact_info">
      <h4>{{ user.firstName }} {{ user.lastName }}</h4>
      <p>{{ user.username }}</p>
    </div>
    <button @click="this.updateFriendList">
      <font-awesome-icon :icon="addIcon" class="add_icon" />
      <span>Add</span>
    </button>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { mapActions } from "vuex";

export default {
  name: "ContactListItem",
  props: ["user"],
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      addIcon: faPlus,
    };
  },
  methods: {
    ...mapActions("user", ["addNewContact", "fetchFriends"]),
    updateFriendList() {
      this.addNewContact({ userId: this.userId, contactId: this.user._id });
      this.fetchFriends(this.userId);
    },
  },
  computed: {
    userId() {
      return JSON.parse(localStorage.getItem("user")).id;
    },
  },
};
</script>

<style lang="scss" scoped>
.contact_list_item {
  display: flex;
  align-items: center;
  justify-content: space-between;

  font-family: $montserrat;
  .contact_info {
    padding: 5px 0;
    h4 {
      font-size: 14px;
      color: var(--accent-clr);
    }

    p {
      font-size: 14px;
      font-weight: map-get($font_weights, "medium");
      color: var(--other-clr-1);
    }
  }

  button {
    width: 60px;
    padding: 4px 0px;
    span {
      margin-left: 5px;
    }
  }

  &:hover {
    background: linear-gradient(to right, transparent, var(--primary-clr), transparent);
  }
}
</style>