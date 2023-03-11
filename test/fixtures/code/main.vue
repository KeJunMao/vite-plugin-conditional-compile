<template>
  <div class="app">
    <!-- #v-ifdef !DEV -->
    !DEV
    <!-- #v-endif -->
    Default
  </div>
</template>

<script lang="ts" setup>
const data = ref(0);
// #v-ifdef PROD
data.value = 1;
// #v-endif
</script>

<style>
.app {
  /* #v-ifdef DEV */
  color: red;
  /* #v-endif */
}
</style>
