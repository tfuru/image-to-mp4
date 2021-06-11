import * as functions from "firebase-functions";
import admin from "firebase-admin";
admin.initializeApp();

import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

import path from "path";
import os from "os";
import fs from "fs";

import {v4 as uuidv4} from "uuid";
import mkdirp from "mkdirp";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
/*
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
*/

// Storage に 新しいオブジェクト ができた時実行される
// functions.region('asia-northeast1').storage.object().onFinalize
exports.imageToMp4 = functions.storage.object().onFinalize(async (object) => {
  const fileBucket = object.bucket;
  const filePath = object.name;
  const contentType = object.contentType;
  const metageneration = object.metageneration;

  if ((contentType != null)&&(!contentType.startsWith("image/"))) {
    return functions.logger.log("This is not an image.");
  }

  if (fileBucket == null) {
    return functions.logger.log("fileBucket is null");
  }

  if (filePath == null) {
    return functions.logger.log("filePath is null");
  }

  functions.logger.log("ffmpegPath", ffmpegPath);
  functions.logger.log("fileBucket", fileBucket);
  functions.logger.log("filePath", filePath);
  functions.logger.log("contentType", contentType);
  functions.logger.log("metageneration", metageneration);

  const imageFileName = path.basename(filePath);
  const ext = path.extname(filePath);
  functions.logger.log("imageFileName", imageFileName);
  functions.logger.log("ext", ext);
  const mp4FileName = imageFileName.replace(ext, ".mp4");

  const bucket = admin.storage().bucket(fileBucket);
  const tempImageFilePath = path.join(os.tmpdir(), imageFileName);
  const tmpDir = path.dirname(tempImageFilePath);
  const tempMp4FilePath = path.join(os.tmpdir(), mp4FileName);

  // tmp ディレクトリ 作成
  await mkdirp(tmpDir);
  if (fs.existsSync(tmpDir) == false) {
    // tmp ディレクトリ 作成失敗
    return functions.logger.log("tmpDir is not found");
  }

  // アップロードされたファイルをtmp ディレクトリに Download する
  await bucket.file(filePath).download({destination: tempImageFilePath});
  functions.logger.log("tmpDir", tmpDir);
  functions.logger.log("tempImageFilePath", tempImageFilePath);
  functions.logger.log("tempMp4FilePath", tempMp4FilePath);

  if (fs.existsSync(tempImageFilePath) == false) {
    // ダウンロードされていない
    return functions.logger.log("tempImageFilePath is not found");
  }

  const uuid = uuidv4();
  const metadata = {
    contentType: "video/mp4",
    metadata: {
      firebaseStorageDownloadTokens: uuid,
    },
  };
  functions.logger.log("metadata", metadata);
  // tempFilePath を ffmpg で mp4 に変換 して bucket に アップロードする
  // ffmpeg -r 1 -i 239476.png -loop 0 -vcodec libx264
  //   -pix_fmt yuv420p -r 60 out.mp4

  return new Promise((resolut, reject) => {
    ffmpeg(tempImageFilePath)
        .setFfmpegPath(ffmpegPath)
        // .input(tempImageFilePath)
        .output(tempMp4FilePath)
        .outputOptions([
          "-r 1",
          "-loop 0",
          "-vcodec libx264",
          "-pix_fmt yuv420p",
          "-r 60",
        ])
        .on("end", async (error, stdout) => {
          functions.logger.log(stdout);
          // tempMp4FilePath を bucket に アップロードする
          await bucket.upload(tempMp4FilePath, {
            metadata: metadata,
          });
          // 変換処理が終わったらテンポラリファイルを削除
          fs.unlinkSync(tempImageFilePath);
          resolut("ok");
        })
        .on("error", (error, stdout, stderr) => {
          functions.logger.log(error);
          functions.logger.log(stdout);
          functions.logger.log(stderr);
          reject(error);
        })
        .run();
  });
});