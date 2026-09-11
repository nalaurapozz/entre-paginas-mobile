import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mesmo projeto Firebase já usado pelo app web "Entre Páginas"
// (reaproveita o Firestore e as regras de segurança já existentes).
const firebaseConfig = {
  apiKey: "AIzaSyDZTq4QaaexVI2Mwhn-rggMKIWz_28EmoE",
  authDomain: "receitas-utf.firebaseapp.com",
  projectId: "receitas-utf",
  storageBucket: "receitas-utf.firebasestorage.app",
  messagingSenderId: "316137555722",
  appId: "1:316137555722:web:75d27863f6847842609095",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// initializeAuth (em vez de getAuth) com persistência em AsyncStorage é o
// que garante que o usuário continua logado depois de fechar e reabrir o app.
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
