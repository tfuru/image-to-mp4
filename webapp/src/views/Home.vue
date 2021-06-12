<template>
  <div v-if="isLogin == false">
    <common-header />
    <login />
  </div>
  <div v-else>
    <common-header />
    <file-upload />
    <logout />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import store from "../store";

import CommonHeader from "@/components/CommonHeader.vue";
import Login from "@/components/Login.vue";
import Logout from "@/components/Logout.vue";
import FileUpload from "@/components/FileUpload.vue";

export default Vue.extend({
  name: "Home",
  data: () => ({
    message: "",
  }),
  components: {
    CommonHeader,
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
