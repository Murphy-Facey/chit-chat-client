<template>
  <div class="alert">
    <p>{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: "Alert",
  props: ["error"]
};
</script>

<style lang="scss" scoped>
.alert {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;

  background: $imperial_reed;
  border-radius: 4px;

  font-size: 14px;

  color: var(--accent-clr);
}
</style>