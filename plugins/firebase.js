import Vue from 'vue'

import firebase from 'firebase'
Vue.config.productionTip = false
const config = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env,
}

if (firebase.apps.length === 0) {
  firebase.initializeApp(config)
}
