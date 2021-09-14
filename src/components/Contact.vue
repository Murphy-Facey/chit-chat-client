<template>
  <div class="contact" @click.prevent="newChat">
    <div  class="contact_container">
      <div class="contact_image" :class="{ active: contact.isOnline }">
        <img src="https://randomuser.me/api/portraits/men/91.jpg" />
      </div>
      <div class="contact_info">
        <p class="time_sent">{{ getTime }}</p>
        <p class="contact_name">
          {{ contact.firstName }} {{ contact.lastName }}
        </p>
        <p class="last_message">{{ contact.latestMessage.message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Contact",
  props: ["contact"],
  computed: {
    getTime() {
      let { dateSent } = this.contact.latestMessage;

      if (dateSent == null) return "";

      let date = typeof dateSent == "string" ? new Date(dateSent) : dateSent;
      
      let differenceInTime = new Date().getTime() - date.getTime();
      let differenceInDays = (differenceInTime / (1000 * 3600 * 24)).toFixed(0);
      
      if(differenceInDays > 1) {
        return date.toLocaleString("en-US", {
          day: "numeric",
          month: "numeric",
          year: "numeric"
        });
      } else if(differenceInDays == 1) {
        return "Yesterday";
      }

      return date.toLocaleString("en-US", {
        hour: 'numeric',
        minute: 'numeric'
      });
    },
  },
  methods: {
    newChat() {
      let userId = JSON.parse(localStorage.getItem("user")).id;
      this.$store.dispatch("user/createNewChat", {
        userId,
        contactId: this.contact._id,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.contact {
  width: 100%;
  padding: 0 10px;
  margin-bottom: 5px;

  position: relative;

  .contact_container {
    display: flex;

    padding: 5px 0;

    border-bottom: 1px solid var(--accent-clr);
    position: relative;

    .contact_image {
      margin-right: 10px;
      height: 100%;
      display: grid;
      place-items: center;

      position: relative;

      img {
        width: 40px;
        border-radius: 50px;
        border: 2px solid var(--accent-clr);
      }

      &::before {
        content: "";
        position: absolute;
        bottom: 0px;
        right: 0px;

        width: 12px;
        height: 12px;
        background: crimson;
        border-radius: 12px;
        border: 2px solid var(--other-clr-1);

        z-index: 2;
      }

      &.active::before {
        background: lime;
      }
    }

    .contact_info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;

      position: relative;

      width: 100%;

      .time_sent {
        position: absolute;
        top: 0;
        right: 0px;

        font-size: 12px;
        font-family: $montserrat;
      }

      .contact_name {
        font-family: $montserrat;
        font-size: 14px;
        font-weight: map-get($font_weights, "semi_bold");
        color: var(--other-clr-1);
      }

      .last_message {
        font-family: $montserrat;
        font-size: 12px;
        color: var(--other-clr-2);
        // opacity: 0.5;
      }
    }
  }

  &:hover {
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;

      width: 5px;
      height: 100%;

      background: crimson;
    }

    .contact_container::before {
      content: "";

      position: absolute;
      top: 0;
      left: -5px;

      width: 100%;
      height: 100%;
      background: linear-gradient(
        to right,
        var(--background-clr),
        transparent
      );
      // opacity: 0.5;
    }
    .contact_container * {
      z-index: 1;
    }
  }
}
</style>