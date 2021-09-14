<template>
  <div class="contact_modal">
    <contact-list />
  </div>
</template>

<script>
import ContactList from "./ContactList.vue";

export default {
  name: "ContactModal",
  components: {
    ContactList
  },
};
</script>

<style lang="scss" scoped>
.contact_modal {
  width: 100%;
  padding: 5px 10px;

  position: absolute;
  top: 100%;
  transform: translateY(10px);
  z-index: 1;

  background: var(--secondary-clr);
  border-radius: 5px;

  overflow: hidden;
}
</style>