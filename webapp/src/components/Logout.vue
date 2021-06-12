<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h1>Logout</h1>
        <p>{{ message }}</p>
        <v-btn elevation="2" x-large @click="clickLogout">ログアウト</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import firebase from "@/plugins/firebase";

export default Vue.extend({
  name: "Logout",
  data: () => ({
      message: "ログアウト",
  }),
  methods: {
    clickLogout: () => {
      firebase.signOut();
    }
  }
});
</script>