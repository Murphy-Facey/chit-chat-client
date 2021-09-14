<template>
  <div class="message" :class="{ right: getUserId == message.userId}">
    <p class="date_sent">{{ getDate }}</p>
    <pre class="message_text">{{ message.message }}</pre>
  </div>
</template>

<script>
export default {
  name: "Message",
  props: ["message"],
  computed: {
    getDate() {
      let date = typeof(this.message.dateSent) == "string" ? new Date(this.message.dateSent) : this.message.dateSent;
      return date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
      });
    },
    getUserId() {
      return JSON.parse(localStorage.getItem("user")).id;
    }
  },
  // methods: {
  // }
};
</script>

<style lang="scss" scoped>
.message {
  width: fit-content;
  max-width: 200px;

  margin-bottom: 8px;
  padding: 5px 10px;

  background: var(--background-clr);
  border-radius: 0px 10px 10px 10px;

  font-family: $montserrat;
  color: var(--other-clr-1);

  word-wrap: break-word;

  .date_sent {

    margin-bottom: 3px;
    
    font-size: 11px;
    text-align: right;
    color: var(--other-clr-2);
  }

  .message_text {
    width: 100%;
    height: 100%;
    
    font-family: $montserrat;
    font-size: 14px;
    font-weight: map-get($font_weights, "medium");
 
    white-space: pre-wrap;
  }

  &.right {
    align-self: flex-end;

    border-radius: 10px 0px 10px 10px;
  }
}
</style>