import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
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
};
