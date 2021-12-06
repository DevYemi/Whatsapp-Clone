import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database';
const firebaseConfig = {
  apiKey: "AIzaSyBZRAH1awQRML2E3qQSf9LY6uiyRaEDR_I",
  authDomain: "whatsappclone-f6d9e.firebaseapp.com",
  projectId: "whatsappclone-f6d9e",
  storageBucket: "whatsappclone-f6d9e.appspot.com",
  messagingSenderId: "636734971219",
  appId: "1:636734971219:web:6e5e4828737d9dd9dd15a6",
  databaseURL: "https://whatsappclone-f6d9e-default-rtdb.firebaseio.com/",
  measurementId: "G-3RY6ZL853P"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider, storage }
export default db