<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
}
</script>

<style lang="scss">

*, *::before, *::after {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

:root {
  --primary-clr: #{$davys_grey};
  --secondary-clr: #{$slate_grey};
  --accent-clr: #{$charleston_green};
  --background-clr: #{$gun_metal};
  // --accent-clr: ;

  --other-clr-1: #{$cultured};
  --other-clr-2: #{$cadet_blue_crayola};
}

[data-theme="light"] {
  --primary-clr: #{$light_gray};
  --secondary-clr: #{$cadet_blue_crayola};
  --accent-clr: #{$light_cultured};
  --background-clr: #{$gainsboro};
  // --accent-clr: ;

  --other-clr-1: #{$charleston_green};
  --other-clr-2: #{$davys_grey};
}

@media(prefers-color-scheme: light) {
  :root {
    --primary-clr: #{$light_gray};
    --secondary-clr: #{$cadet_blue_crayola};
    --accent-clr: #{$light_cultured};
    --background-clr: #{$gainsboro};
    // --accent-clr: ;

    --other-clr-1: #{$charleston_green};
    --other-clr-2: #{$davys_grey};
  }  

  [data-theme="dark"] {
  --primary-clr: #{$davys_grey};
    --secondary-clr: #{$slate_grey};
    --accent-clr: #{$charleston_green};
    --background-clr: #{$gun_metal};
    // --accent-clr: ;

    --other-clr-1: #{$cultured};
    --other-clr-2: #{$cadet_blue_crayola};
  }
}

#app {
  height: 100vh;
  background: var(--background-clr);
}
</style>
