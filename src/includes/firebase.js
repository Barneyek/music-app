import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBXg4vKYwtRgYZ-V_MIz8rTKX5f70ke9Cs",
  authDomain: "music-app-c416d.firebaseapp.com",
  projectId: "music-app-c416d",
  storageBucket: "music-app-c416d.appspot.com",
  appId: "1:655705326106:web:ef02af0989a9 b4b55847a3",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

db.enablePersistence().catch((error) => {
  console.log('Firebase persistence error: ', error.code);
});

const usersCollection = db.collection("users");
const songsCollection = db.collection("songs");
const commentsCollection = db.collection("comments");

export {
  auth,
  db,
  usersCollection,
  songsCollection,
  storage,
  commentsCollection,
};
