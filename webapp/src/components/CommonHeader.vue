<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <div class="d-flex flex-column justify-space-between align-center">
          <v-img
            alt="ImageToMp4"
            class="shrink mr-2"
            contain
            src="ImageToMp4.png"
            transition="scale-transition"
            width="300"
          />
        </div>
        <p>画像(png,jpeg) をアップロードすると <br />MP4 ダウンロード用URLを生成するサービスです</p>        
      </v-col>
    </v-row>   
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import firebase from "@/plugins/firebase";

export default Vue.extend({
  name: "CommonHeader"
});
</script>