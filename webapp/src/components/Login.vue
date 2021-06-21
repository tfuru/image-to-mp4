<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <div id="firebaseui-auth-container"></div>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col cols="12">
        <v-btn text @click="clickBtnAnonymously">
          アカウントを作らずに利用する
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import firebase from "firebase/app";
import "firebase/auth";

import * as firebaseui from "firebaseui-ja";
import "firebaseui-ja/dist/firebaseui.css";

import PluginsFirebase from "@/plugins/firebase";

export default Vue.extend({
  name: "Login",
  data: () => ({
    message: "ログイン",
  }),
  mounted: () => {
    const uiConfig = {
      signInFlow: "popup",
      signInSuccessUrl: "/",
      signInOptions: [
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: false,
        },
      ],
      tosUrl: "/terms",
      privacyPolicyUrl: "/privacy",
      autoUpgradeAnonymousUsers: true,
    };
    const ui =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebase.auth());
    ui.start("#firebaseui-auth-container", uiConfig);
  },
  methods: {
    clickBtnAnonymously: async () => {
      console.log("clickBtnAnonymously");
      PluginsFirebase.signInAnonymously();
    },
  },
});
</script>
