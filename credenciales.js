import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAje4RFxgvUBoSo70hgRPFwmuauK0b2geU",
  authDomain: "eventos-b5f35.firebaseapp.com",
  projectId: "eventos-b5f35",
  storageBucket: "eventos-b5f35.firebasestorage.app",
  messagingSenderId: "426793860123",
  appId: "1:426793860123:web:cd7a6c89193572f9010cbe",
  measurementId: "G-8FBYP259E4"
};

const appFirebase = initializeApp(firebaseConfig);

export default appFirebase;
