<template>
  <login v-if="isLogin == false" />
  <div v-else>
    <file-upload />
    <logout />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import store from "../store";

import Login from "@/components/Login.vue";
import Logout from "@/components/Logout.vue";
import FileUpload from "@/components/FileUpload.vue";

export default Vue.extend({
  name: "Home",
  data: () => ({
    message: "",
  }),
  components: {
    Login,
    Logout,
    FileUpload,
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
