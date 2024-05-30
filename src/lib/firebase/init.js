import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {initializeAuth} from "firebase/auth";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBVZ1wJJvYRDLt30A8R_NDyKAsExUjz-as",
  authDomain: "jongdementie-mobile.firebaseapp.com",
  projectId: "jongdementie-mobile",
  storageBucket: "jongdementie-mobile.appspot.com",
  messagingSenderId: "935504245196",
  appId: "1:935504245196:web:ae8fee9a068bf34c6fed69",
};

let app;
let auth;
let db;
let storage;

app = initializeApp(firebaseConfig);
auth = initializeAuth(app);
db = getFirestore(app);
storage = getStorage(app);

export {app, auth, db, storage};
