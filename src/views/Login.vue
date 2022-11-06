<template>
  <v-main>
    <v-container>
      <v-card
        class="mx-auto mt-5"
        width="400"
        outlined
        color="primary lighten-5"
      >
        <v-card-title> Log In</v-card-title>
        <v-card-text class="py-10">
          <v-alert
            type="info"
            v-if="$route.query.message"
            border="left"
          >
            {{ $route.query.message }}
          </v-alert>
          <div class="d-flex justify-center mt-10 mb-10">
            <v-btn
              color="#4285F4"
              dark
              class="text-capitalize"
              @click="login()"
            >
              <v-icon class="mr-2">mdi-google</v-icon>
              Continue with Google
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import Auth from '../services/auth';

const auth = new Auth();
export default {
  metaInfo: {
    title: 'Login',
  },
  data() {
    return {
      err: null,
    };
  },
  methods: {
    login() {
      auth
        .login()
        .then((res) => {
          const data = {
            uid: res.user.uid,
            email: res.user.email,
            name: res.user.displayName,
          };
          this.$store.dispatch('login', data);
          const path = this.$route.query.next || '/dashboard';
          this.$router.push(path);
        })
        .catch((err) => {
          this.error = err.message;
        });
    },
  },
};
</script>

<style>
</style>
