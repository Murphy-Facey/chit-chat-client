<template>
  <div class="login">
    <div class="login_container">
      <div class="login_left_side">
        <h1>Welcome Back</h1>
        <p>Glad to see you back on our site</p>
      </div>
      <div class="login_right_side">
        <h2>Login</h2>
        <alert v-if="this.getErrors" :error="getErrorMessage()" />
        <div class="input_field">
          <p>Username</p>
          <input
            type="text"
            placeholder="Enter username"
            v-model="username"
            :class="{ error: getErrorFields('username') }"
          />
        </div>
        <div class="input_field">
          <p>Password</p>
          <input
            type="password"
            placeholder="Enter password"
            v-model="password"
            :class="{ error: getErrorFields('password') }"
          />
        </div>
        <div class="login_btns">
          <button @click="handleSubmit">Login</button>
          <p>
            Are you new to this site?
            <router-link to="/register">Register</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";

import Alert from "./Alert.vue";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  components: {
    Alert,
  },
  computed: {
    ...mapGetters("authentication", ["getErrors"]),
  },
  methods: {
    ...mapMutations("authentication", ["loginFailure"]),
    ...mapActions("authentication", ["login"]),
    handleSubmit() {
      const { username, password } = this;
      this.login({ username, password });
    },
    getErrorFields(fieldName) {
      if (this.getErrors) return this.getErrors.fields.includes(fieldName);

      return false;
    },
    getErrorMessage() {
      if (this.getErrors) return this.getErrors.msg;
      return "No Error";
    },
  },
  mounted() {
    this.loginFailure(null);
  },
};
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  position: relative;

  display: grid;
  place-items: center;

  font-family: $montserrat;

  .login_container {
    width: 900px;
    height: 500px;
    background: var(--primary-clr);

    display: flex;

    // box-shadow: 0 0 15px -2px rgba(0, 0, 0, 0.5);

    .login_left_side {
      width: 50%;
      height: 100%;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      background: var(--secondary-clr);
    }

    .login_right_side {
      flex-grow: 1;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0px 50px;

      h2 {
        width: 350px;
        margin-bottom: 20px;
        align-self: center;
      }

      .input_field {
        margin-bottom: 20px;

        p {
          margin-bottom: 10px;
          font-size: 14px;
        }

        input {
          width: 100%;
          padding: 10px 0;
          text-indent: 10px;

          background: var(--accent-clr);
          border: 1px solid transparent;
          border-radius: 4px;
          outline: none;

          font-family: $montserrat;
          color: var(--other-clr-2);

          &:hover,
          &:focus {
            border-color: var(--other-clr-2);
          }

          &.error {
            border-color: $carnelian;

            &:hover,
            &:focus {
              box-shadow: 0 0 0px 4px #e5383b5d;
            }
          }
        }
      }

      .login_btns {
        display: flex;
        align-items: center;

        font-size: 14px;

        button {
          padding: 7px 25px;
          margin-right: 10px;

          background: var(--other-clr-1);
          border: none;
          border-radius: 4px;

          font-family: $montserrat;
          font-weight: map-get($font_weights, "semi_bold");
          color: var(--background-clr);

          &:hover {
            cursor: pointer;
            background: var(--other-clr-2);
          }
        }

        p {
          color: var(--other-clr-2);
        }

        a {
          padding: 2px 5px;

          border-radius: 2px;

          font-weight: map-get($font_weights, "medium");
          text-decoration: none;
          color: var(--other-clr-1);

          &:hover {
            background: var(--secondary-clr);
            // color: var(--other-clr-2);
          }
        }
      }
    }
  }
}
</style>