<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <div id="firebaseui-auth-container"></div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import store from '@/store';
import firebase from "firebase/app";
import "firebase/auth";

import * as firebaseui from 'firebaseui';
require("firebaseui-ja/dist/firebaseui.css");

export default Vue.extend({
  name: "Login",
  data: () => ({
      message: "ログイン",
  }),
  mounted: () => {
    console.log("mounted", this);
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
      privacyPolicyUrl: "/privacy"
    };
    
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);
  },
});
</script>