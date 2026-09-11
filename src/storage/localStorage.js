import AsyncStorage from "@react-native-async-storage/async-storage";

// Armazenamento local (AsyncStorage) — usado só para dados que não
// precisam sincronizar entre dispositivos: preferências do usuário e um
// atalho para o último livro aberto. Os livros/páginas em si moram no
// Firestore (ver src/services/firebase.js).

const CHAVE_ULTIMO_LIVRO = "@entrepaginas:ultimo_livro";
const CHAVE_PREFERENCIAS = "@entrepaginas:preferencias";

export async function salvarUltimoLivro(livroId) {
  try {
    await AsyncStorage.setItem(CHAVE_ULTIMO_LIVRO, livroId);
  } catch {
    // Falha de storage local não deve travar o app.
  }
}

export async function obterUltimoLivro() {
  try {
    return await AsyncStorage.getItem(CHAVE_ULTIMO_LIVRO);
  } catch {
    return null;
  }
}

export async function salvarPreferencias(preferencias) {
  try {
    await AsyncStorage.setItem(CHAVE_PREFERENCIAS, JSON.stringify(preferencias));
  } catch {
    // Falha de storage local não deve travar o app.
  }
}

export async function obterPreferencias() {
  try {
    const raw = await AsyncStorage.getItem(CHAVE_PREFERENCIAS);
    return raw ? JSON.parse(raw) : { notificacoesAtivas: false };
  } catch {
    return { notificacoesAtivas: false };
  }
}
