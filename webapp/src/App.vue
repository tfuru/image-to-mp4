<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">ImageToMp4</div>

      <v-spacer></v-spacer>
      <v-btn v-if="isLogin == true" text @click="clickLogout">
        <span class="mr-2">ログアウト</span>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import store from "@/store";

import firebase from "@/plugins/firebase";

export default Vue.extend({
  name: "App",
  data: () => ({
    //
  }),
  computed: {
    isLogin() {
      return store.getters.isSignIn;
    },
  },
  methods: {
    clickLogout: () => {
      firebase.signOut();
    },
  },
});
</script>
