<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h1>ImageToMp4</h1>
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
            <!-- 画像 情報の表示 -->
            <!--
            <v-progress-linear
                v-if="isImageProgress"
                indeterminate
                color="green"></v-progress-linear>
            <v-img
                align-content="center"
                :src="imgSrc" >
            </v-img>
            -->
        </div>
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
            <v-input 
                hint="MP4 URL"
                persistent-hint 
                >{{mp4Src}}</v-input>
        </div>
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
  }),
  methods: {
    clickFile() {
      this.imgSrc = "";
      this.mp4Src = "";
    },
    changeFile(file: File) {
      console.log("changeFile", file);
      if ((file == null) || (file.type != "image/png") && (file.type != "image/jpeg")) {
          this.imgSrc = "";
          this.mp4Src = "";
          return;
      }
      this.imgSrc = window.URL.createObjectURL(file);
      
      // Firestore監視
      this.isMp4Progress = true;
      this.mp4Src = "";

      // アップロード処理
      this.isImageProgress = true;
      firebase.fileUpload(file,(snapshot) => {
        console.log("snapshot", snapshot);
        // 画像　アップロード 完了
        this.isImageProgress = false;
      });
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
                  this.isMp4Progress = false;
                }
            });
        });        
    }
  },
  mounted() {
      console.log("mounted this", this);
      this.onSnapshot();
  }
});
</script>