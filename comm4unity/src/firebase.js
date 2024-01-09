// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxEW6xE9VUIOUus3xrTj0kJrTVdtfLt78",
  authDomain: "comm4unity.firebaseapp.com",
  projectId: "comm4unity",
  storageBucket: "comm4unity.appspot.com",
  messagingSenderId: "668228316450",
  appId: "1:668228316450:web:bf8876de7707f93cdb897b",
  measurementId: "G-D0H0GRH3EQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

//google auth
const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        // name: user.name,
        authProvider: "google",
        //email: user.email,
        identifier: user.email,
      });
    }
  } catch (err) {
    console.log(err);
    alert(err.message);
  }
};

// username and password
const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.log(err);
    alert(err.message);
  }
};

// register with email and password
const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
      role: "student",
    });
    alert(user);
  } catch (err) {
    console.log(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.log(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

export {
  db,
  auth,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
