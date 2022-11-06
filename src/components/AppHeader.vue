<template>
  <v-app-bar app flat color="white">
    <v-toolbar-title>
      <router-link to="/">
        <v-img src="@/assets/logo.png" class="cursor-pointer" max-width="200"></v-img>
      </router-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn
      v-for="link in links"
      :key="link.to"
      :to="link.to"
      class="mx-1 text-capitalize"
      color="purple"
      text
    >
      {{ link.text }}
      <v-icon v-if="link.icon">
        {{link.icon}}
      </v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  computed: {
    userInitial() {
      return String(this.$store.state.user.name).slice(0, 1);
    },
    links() {
      const data = [{ text: 'Home', to: '/' }];
      if (this.$store.state.loggedIn) {
        data.push({ text: 'Dashboard', to: '/dashboard' });
        data.push({ text: '', to: '/logout', icon: 'mdi-logout' });
      } else {
        data.push(
          ...[
            { text: 'Log In', to: '/login' },
            // { text: 'Sign Up', to: '/signup' },
          ],
        );
      }
      return data;
    },
  },
};
</script>

<style>
.cursor-pointer{
  cursor: pointer;
}
</style>
