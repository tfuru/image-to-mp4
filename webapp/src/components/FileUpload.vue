<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">      
        <div class="d-flex flex-column justify-space-between align-center">
            <!-- 画像 情報の表示 -->
            <!--
            <v-progress-linear
                v-if="isImageProgress"
                indeterminate
                color="green"></v-progress-linear>
            -->
            <v-img 
                max-width="250"
                max-height="250"
                align-content="center"
                :src="imgSrc" >
            </v-img>
        </div>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col cols="12">
        <v-file-input
            label="File input"
            truncate-length="15" 
            accept="image/png, image/jpeg"
            show-size
            counter
            @click="clickFile"
            @change="changeFile">
        </v-file-input>
      </v-col>
    </v-row>    
    <v-row class="text-center">
      <v-col cols="12">
        <div class="d-flex flex-column justify-space-between align-center">
            <!-- MP4 情報の表示 -->
            <v-progress-linear
                v-if="isMp4Progress"
                indeterminate
                color="green"></v-progress-linear>
            <v-alert elevation="2" type="warning" v-if="error.isError">
              変換に失敗しました。画像の縦横サイズが大きすぎる可能性があります。
            </v-alert>
        </div>
        <v-text-field
            hint="mp4変換後 の URL"
            persistent-hint
            @click="clickMp4Url"
            single-line
            full-width
            v-model="mp4Src">
        </v-text-field>        
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col cols="12" v-if="mp4Src != ''">
        <a :href="mp4Src" :download="mp4FileName">ダウンロード</a>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import firebase from "@/plugins/firebase";

export default Vue.extend({
  name: "FileUpload",
  data: () => ({
    isImageProgress: false,
    isMp4Progress: false,
    imgSrc: "",
    mp4Src: "",
    error: {
      isError: false,
      message: "",
    },
    mp4FileName: "",
  }),
  methods: {
    clickFile() {
      this.imgSrc = "";
      this.mp4Src = "";
      this.isMp4Progress = false;
      this.isImageProgress = false;
    },
    changeFile(file: File) {
      console.log("changeFile", file);
      if ((file == null) || (file.type != "image/png") && (file.type != "image/jpeg")) {
          this.imgSrc = "";
          this.mp4Src = "";
          this.isMp4Progress = false;
          this.isImageProgress = false;
          return;
      }
      this.imgSrc = window.URL.createObjectURL(file);
      
      this.mp4FileName = file.name.replace(/(png|jpg)/, "mp4");
      console.log("mp4FileName", this.mp4FileName);
      
      // Firestore監視
      this.isMp4Progress = true;
      this.mp4Src = "";

      // アップロード処理
      this.isImageProgress = true;
      firebase.fileUpload(file,(snapshot) => {
        console.log("snapshot", snapshot);
        this.isImageProgress = false;
      });
    },
    clickMp4Url(event: any) {
      console.log("event", event.target);
      event.target.select();
    },
    onSnapshot() {
        // 初回だけ監視を実行
        firebase.onSnapshot((collection) => {
            console.log("collection", collection);
            if ((collection == null) || (collection.size == 0)) {
                return;
            }
            collection.docChanges().forEach((change) => {
                console.log("change", change);
                console.log("imgSrc", this.imgSrc);
                if ((change.type === "added") || (change.type === "modified")) {
                  if (this.imgSrc == ""){
                    return;
                  }

                  // 追加, 更新
                  const data = change.doc.data();
                  console.log("doc data", data);
                  // mp4 ダウンロードURL
                  this.mp4Src = data.mp4;

                  if (data.mp4 == "") {
                    // エラー発生時 data.mp4 が 空白
                    this.error.message = data.error;
                    this.error.isError = true;
                  }
                  this.isMp4Progress = false;
                }
            });
        });        
    },
  },
  mounted() {
      console.log("mounted this", this);
      this.onSnapshot();
  }
});
</script>