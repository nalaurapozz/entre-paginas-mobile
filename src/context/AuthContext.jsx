import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCarregando(false);
    });
    return unsubscribe;
  }, []);

  async function entrar(email, senha) {
    await signInWithEmailAndPassword(auth, email, senha);
  }

  async function cadastrar(nome, email, senha) {
    const credencial = await createUserWithEmailAndPassword(auth, email, senha);
    await setDoc(doc(db, "usuarios", credencial.user.uid), {
      nome,
      email,
      avatar: null,
      preferencias_notificacao: false,
    });
  }

  async function sair() {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, entrar, cadastrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth precisa estar dentro de um AuthProvider");
  return contexto;
}
