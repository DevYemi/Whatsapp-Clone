import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/database';
const firebaseConfig = {
  apiKey: "AIzaSyDR7JBKwAm_i8bjrf_One2xi1S5_hIc9Q8",
  authDomain: "whatsapp-clone-efb49.firebaseapp.com",
  databaseURL: "https://whatsapp-clone-efb49.firebaseio.com",
  projectId: "whatsapp-clone-efb49",
  storageBucket: "whatsapp-clone-efb49.appspot.com",
  messagingSenderId: "465630611116",
  appId: "1:465630611116:web:8700cd3bd62295743a0109",
  measurementId: "G-5ZQ2ETHDEH"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider, storage }
export default db