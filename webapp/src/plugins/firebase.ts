import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";

import store from "../store";

const firebaseConfig = {
  apiKey: "AIzaSyAJ0p-lEkKngYxKkbwzhPmVFmUIyLsYa04",
  authDomain: "image-to-mp4.firebaseapp.com",
  projectId: "image-to-mp4",
  storageBucket: "image-to-mp4.appspot.com",
  messagingSenderId: "257677425193",
  appId: "1:257677425193:web:d6112f9feb448cd363fa38",
  measurementId: "G-HE11HYFR31",
};

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
};
