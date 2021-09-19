<template>
  <div class="register">
    <div class="register_container">
      <div class="register_left_side">
        <h2>Register</h2>
        <alert v-if="this.getErrors" :error="getErrorMessage()" />
        <div class="input_fields">
          <div class="input_field">
            <p>First Name</p>
            <input type="text" placeholder="Enter first name" v-model="firstName" :class="{ error: getErrorField('firstName') }" />
          </div>
          <div class="input_field">
            <p>Last Name</p>
            <input type="text" placeholder="Enter last name" v-model="lastName" :class="{ error: getErrorField('lastName') }" />
          </div>
        </div>
        <div class="input_field">
          <p>Username</p>
          <input type="text" placeholder="Enter username" v-model="username" :class="{ error: getErrorField('username') }"/>
        </div>
        <div class="input_field">
          <div class="password_info">
            <p>Password</p>
            <p class="tooltip">
              <b>Accepted Password</b>: Password length must between 8 and 25 characters, and the strength must be weak or above.
            </p>
            <!-- <font-awesome-icon :icon="infoIcon" class="info_icon" /> -->
          </div>
          <input type="password" placeholder="Enter password" v-model="password" @input="checkPasswordStrength" :class="{ error: getErrorField('password') }" />
          <p class="strength_indicator" :class="[passwordStrength.toLowerCase()]" >
            {{ passwordStrength }}
          </p>
        </div>
        <div class="register_btns">
          <button @click="registerEvent">Register</button>
          <p>Already have an account?
            <router-link to="/login">Login</router-link>
          </p>
        </div>
      </div>
      <div class="register_right_side">
        <h1>Hello Newbie</h1>
        <p>Welcome to our chat site</p>
      </div>
    </div>
  </div>
</template>

<script>
// import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
// import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { passwordStrength } from "check-password-strength";

import { mapActions, mapGetters, mapMutations } from "vuex";

import Alert from "./Alert.vue";

export default {
  name: "Register",
  components: {
    // FontAwesomeIcon,
    Alert
  },
  data() {
    return {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      // infoIcon: faInfo,
      passwordStrength: "too_weak"
    }
  },
  computed: {
    ...mapGetters("authentication", ["getErrors"]),
  },
  methods: {
    ...mapMutations("authentication", ["loginFailure"]),
    ...mapActions("authentication", ["register"]),
    registerEvent() {
      const { firstName, lastName, username, password } = this;
      this.register({ firstName, lastName, username, password });
    },
    checkPasswordStrength() {
      let strength = passwordStrength(this.password);
      this.passwordStrength = strength.value == "Too weak" ? "too_weak" : strength.value;
    },
    getErrorField(fieldName) {
      if(this.getErrors) {
        return this.getErrors.fields.includes(fieldName);
      }
      return false;
    },
    getErrorMessage() {
      if(this.getErrors) {
        return this.getErrors.msg;
      }
      return "No Error";
    }
  },
  mounted() {
    this.loginFailure(null)
  }
};
</script>

<style lang="scss" scoped>
.register {
  width: 100%;
  height: 100%;

  display: grid;
  place-items: center;

  font-family: $montserrat;

  .register_container {

    width: min(900px, 90%);
    height: 500px;

    display: flex;
    align-items: center;

    background: var(--primary-clr);

    .register_left_side {
      width: 50%;
      height: 100%;

      display: flex;
      flex-direction: column;
      justify-content: center;


      & > * {
        width: 380px;
        margin: 0 auto;
      }

      h2 {
        margin-bottom: 20px;
      }

      .input_fields {
        display: flex;

        .input_field {
          position: relative;
  
          p {
            margin-bottom: 5px;

            font-size: 14px;
            color: var(--other-clr-1);
          }
  
          input {
            padding: 9px 0;

            border: 1px solid transparent;
            border-radius: 3px;
            outline: none;
            
            font-family: $montserrat;
            font-size: 14px;
            text-indent: 10px;

            background: var(--accent-clr);
            color: var(--other-clr-1);

            &:hover,
            &:focus {
              border-color: var(--other-clr-2)
            }

            &.error {
              border-color: $carnelian;

              &:hover,
              &:focus {
                box-shadow: 0 0 0px 4px #e5383b42;
              }
            }
          }

          .strength_indicator {
            width: 100%;
            height: 4px;

            display: flex;
            justify-content: space-between;
          
            position: absolute;
            top: 110%;
            left: 0;

          }

          &:nth-child(1) {
            margin-right: 15px;
          }
        }
      }

      .input_field {
        // width: 422px;

        position: relative;

        p {
          margin: 5px;

          font-size: 14px;
          color: var(--other-clr-1);
        }

        input {
          width: 100%;

          padding: 9px 0;

          border: 1px solid transparent;
          border-radius: 3px;
          outline: none;
          background: var(--accent-clr);
          color: var(--other-clr-1);

          font-family: $montserrat;
          font-size: 14px;
          text-indent: 10px;

          &:hover,
          &:focus {
            border-color: var(--other-clr-2)
          }

          &:nth-child(2) {
            margin-bottom: 10px;
          }

          &.error {
            border-color: $carnelian;

            &:hover,
            &:focus {
              box-shadow: 0 0 0px 4px #e5383b42;
            }
          }
        }

        .password_info {
          width: max-content;
          
          position: relative;

          p:nth-child(1) {
            border-bottom: 2px dotted var(--other-clr-1);
            // margin-bottom: 5px;
          }

         
          .tooltip {
            width: 325px;
            position: absolute;
            top: -65px;
            left: 0px;

            transform: translateY(10px);
            transition: transform ease-in-out 0.25s, opacity ease-in-out 0.25s;

            padding: 5px 10px;

            background: var(--background-clr);
            border-radius: 7px;

            opacity: 0;
            z-index: -1;
          }

          &:hover > .tooltip {
            opacity: 0.9;
            transform: translateY(0px);
            z-index: 1;

          }
        }

        .strength_indicator {
          position: absolute;
          bottom: 11px;
          right: 0px;
          // transform: translateY(-50%);

          padding: 4px 7px;

          background: var(--primary-clr);
          border-radius: 3px;

          font-size: 12px;
          color: var(--other-clr-1);

          &.weak {
            background: $imperial_reed;
          }

          &.medium {
            background: $sheen_green;
          }

          &.strong {
            background: $ygcw;
          }
        }
      }

      .register_btns {
        // width: 422px;

        display: flex;
        align-items: center;

        margin-top: 15px;

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

    .register_right_side {
      width: 50%;
      height: 100%;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      background: var(--secondary-clr);
    }
  }
}
</style>