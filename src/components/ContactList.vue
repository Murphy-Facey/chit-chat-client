<template>
  <div class="contact_list">
    <contact-list-item v-for="user in this.getOtherUsers" :key="user._id" :user="user" />
    <div class="page_nav">
      <p> {{ getShowedPages }} of {{ this.getUsersCount }}</p>
      <button @click="prevPage" :disabled="getShowedPages <= 7">Prev</button>
      <button @click="nextPage" :disabled="getShowedPages == this.getUsersCount">Next</button>
      <button @click="closeModal">
        <font-awesome-icon :icon="closeIcon" />
      </button>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { mapGetters } from "vuex";

import ContactListItem from "./ContactListItem.vue";

export default {
  name: "ContactList",
  data() {
    return {
      closeIcon: faTimes
    }
  },
  components: {
    ContactListItem,
    FontAwesomeIcon
  },
  computed: {
    ...mapGetters("user", ["getOtherUsers", "getUsersCount", "getPageNumber", "getSearchInput"]),
    getShowedPages() {
      let { getPageNumber, getUsersCount } = this;
      if(getPageNumber * 7 > getUsersCount) {
        return (getPageNumber - 1) * 7 + (getUsersCount - (getPageNumber - 1) * 7);
      }
      return getPageNumber * 7;
    }
  },
  methods: {
    nextPage() {
      this.$store.commit("user/changePageNumber", 1);

      let searchInput = this.getSearchInput;
      let pageNumber = this.getPageNumber;

      this.$store.dispatch("user/fetchOtherUsers", { searchInput, pageNumber});
    },
    prevPage() {
      this.$store.commit("user/changePageNumber", -1);

      let searchInput = this.getSearchInput;
      let pageNumber = this.getPageNumber;

      this.$store.dispatch("user/fetchOtherUsers", { searchInput, pageNumber});
    },
    closeModal() {
      this.$store.commit("user/setSearchInput", "");
      this.$store.commit("user/setOtherUsers", []);
    }
  }
};
</script>

<style lang="scss" scoped>
.page_nav {
  display: flex;

  padding-top: 10px;

  border-top: 1px solid $charleston_green;

  p {
    font-family: $montserrat;
  }

  button {
    padding: 4px 10px;

    &:nth-child(2) {
      margin-left: auto;
      margin-right: 5px;
    }

    &:nth-child(3) {
      margin-right: 5px;
    }
  }
}
</style>