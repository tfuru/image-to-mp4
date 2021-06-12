<template>
  <login v-if="isLogin == false" />
  <logout v-else />
</template>

<script lang="ts">
import Vue from "vue";
import store from "../store";

import Login from "@/components/Login.vue";
import Logout from "@/components/Logout.vue";

export default Vue.extend({
  name: "Home",
  data: () => ({
    message: "",
  }),
  components: {
    Login,
    Logout,
  },
  computed: {
    isLogin() {
      return store.getters.isSignIn;
    },
  },
  mounted: () => {
    console.log("mounted");
  },
});
</script>
