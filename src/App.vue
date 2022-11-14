<template>
  <v-app>
    <router-view name="header"></router-view>
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  watch: {
    '$route.fullPath':
    {
      handler() {
        setTimeout(() => {
          this.reloadMath();
        }, 1000);
      },
      immediate: true,
    },
  },
};
</script>

<style>
</style>
