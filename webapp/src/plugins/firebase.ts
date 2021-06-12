import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import "firebase/storage";
import "firebase/firestore";

import firebaseConfig from "./firebase-config";
import store from "../store";

export default {
  init: () => {
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
  },
  signOut: () => {
    firebase.auth().signOut();
  },
  onAuth: () => {
    firebase.auth().onAuthStateChanged((user) => {
      store.commit("setUser", user);
      store.commit("setSignIn", user?.uid ? true : false);
    });
  },
  fileUpload: (file: File, callback: (snapshot: firebase.storage.UploadTaskSnapshot) => void) => {
    const user = firebase.auth().currentUser;
    if (user == null){
      // 未ログイン
      return;
    }

    const storageRef = firebase.storage().ref();
    const uploadFileRef = storageRef.child(`${user?.uid}/${file.name}`);
    uploadFileRef.put(file).then(callback);
  },
  onSnapshot: (callback:(collection: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) => void) => {
    const user = firebase.auth().currentUser;
    if (user == null){
      // 未ログイン
      return;
    }

    firebase.firestore()
      .collection(user?.uid)
      .onSnapshot(callback);
      
    /*
    firebase.firestore()
      .collection("tfuru")
      .onSnapshot(callback);
    */
  },
};
