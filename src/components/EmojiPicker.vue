<template>
  <div class="emoji_picker" v-click-outside="closeEmojiPicker">
    <div class="picker_top">
      <div
        class="icon"
        v-for="icon in icons"
        :key="icon.name"
        @click.stop="setSelected(icon.name)"
        :class="{ selected: icon.selected }"
      >
        <font-awesome-icon :icon="icon.icon" />
      </div>
      <div class="select_indicator" :class="[selectIconName]"></div>
    </div>
    <div class="emojis">
      <div
        class="emoji"
        v-for="(category, index) in this.getEmojiCategories"
        :key="index"
        :class="[category]"
      >
        <p
          v-for="(emoji, index) in this.getEmojisInCategory(category)"
          :key="index"
          @click="selectEmoji(emoji)"
        >
          {{ emoji }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faLeaf,
  faPlane,
  faHamburger,
  faLightbulb,
  faHeart,
  faFlag,
  faGrin,
  faFootballBall,
} from "@fortawesome/free-solid-svg-icons";
import { emojis } from "../emojis";

import vClickOutside from "click-outside-vue3";

export default {
  name: "EmojiPicker",
  props: ["setShowEmojiPicker"],
  components: {
    FontAwesomeIcon,
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  data() {
    return {
      icons: [
        { icon: faGrin, name: "peoples", selected: false },
        { icon: faLeaf, name: "nature", selected: false },
        { icon: faHamburger, name: "foods", selected: false },
        { icon: faFootballBall, name: "activity", selected: false },
        { icon: faPlane, name: "places", selected: false },
        { icon: faLightbulb, name: "objects", selected: false },
        { icon: faHeart, name: "symbols", selected: false },
        { icon: faFlag, name: "flags", selected: false },
      ],
      selectIconName: "peoples",
    };
  },
  computed: {
    getEmojiCategories() {
      return [...new Set(emojis.map((emoji) => emoji.category))];
    },
  },
  methods: {
    setSelected(iconName) {
      // console.log(iconName);
      this.selectIconName = iconName;
      this.icons.forEach((icon) => {
        icon.selected = false;
        return icon;
      });

      this.icons = this.icons.map((icon) =>
        icon.name == iconName ? { ...icon, selected: !icon.selected } : icon
      );
      this.scrollTo(iconName);
    },
    getEmojisInCategory(category) {
      return emojis
        .filter((emoji) => emoji.category == category)
        .map((item) => item.emoji);
    },
    scrollTo(category) {
      const categoryTop = document.querySelector(`.${category}`).offsetTop - 10;
      const emojiContainer = document.querySelector(".emojis");

      console.log(categoryTop);
      if (categoryTop != 25)
        emojiContainer.scrollTo(window.scrollX, categoryTop);
    },
    selectEmoji(emoji) {
      this.$emit("selectedEmoji", emoji);
      // this.closeEmojiPicker();
    },
    closeEmojiPicker() {
      this.setShowEmojiPicker(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.select_indicator {
  width: 36px;
  height: 4px;

  position: absolute;
  bottom: 0px;
  // transform: translateX(100%);
  transition: transform ease-in-out 0.25s;

  z-index: 1;

  background: var(--other-clr-2);
  border-radius: 3px 3px 0 0;
  &.peoples {
    transform: translateX(0);
  }
  &.nature {
    transform: translateX(100%);
  }
  &.foods {
    transform: translateX(200%);
  }
  &.activity {
    transform: translateX(300%);
  }
  &.places {
    transform: translateX(400%);
  }
  &.objects {
    transform: translateX(500%);
  }
  &.symbols {
    transform: translateX(600%);
  }
  &.flags {
    transform: translateX(700%);
  }
}

.emoji_picker {
  width: fit-content;
  height: 300px;

  position: absolute;
  bottom: 45px;
  right: 20px;

  overflow: hidden;

  display: flex;
  flex-direction: column;

  // padding: 7px;

  background: var(--other-clr-1);
  border: 2px solid var(--accent-clr);
  border-radius: 5px;

  .picker_top {
    display: flex;

    position: relative;

    .icon {
      width: 36px;
      height: 36px;
      // padding: 10px 10px;

      display: grid;
      place-items: center;
      background: var(--secondary-clr);
      color: var(--accent-clr);

      &.selected {
        color: var(--other-clr-1);
      }

      &:hover {
        background: var(--other-clr-1);
        color: var(--secondary-clr);
      }
    }
  }

  .emojis {
    flex-grow: 1;

    display: flex;
    flex-direction: column;

    overflow: auto;

    scroll-behavior: smooth;

    .emoji {
      display: grid;
      grid-template-columns: repeat(auto-fit, 30px);
      justify-items: center;
      align-items: center;

      p {
        width: 30px;
        height: 30px;

        display: flex;
        justify-content: center;
        align-items: center;

        &:hover {
          background: var(--other-clr-2);
        }
      }

      // align-items: center;
    }
  }
}
</style>