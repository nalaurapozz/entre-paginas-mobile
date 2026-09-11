import { useEffect, useState } from "react";
import { View, Text, Image, Pressable, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../src/services/firebase";
import { salvarUltimoLivro } from "../../../src/storage/localStorage";

export default function DetalhesLivro() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [livro, setLivro] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "livros", id), (snap) => {
      if (snap.exists()) setLivro({ id: snap.id, ...snap.data() });
    });
    salvarUltimoLivro(id);
    return unsubscribe;
  }, [id]);

  async function excluirLivro() {
    Alert.alert("Excluir livro", "O livro vai para o baú (não é apagado de vez). Confirma?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await updateDoc(doc(db, "livros", id), { excluido: true });
          router.replace("/");
        },
      },
    ]);
  }

  if (!livro) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#8B5E3C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {livro.capa_imagem ? (
        <Image source={{ uri: livro.capa_imagem }} style={styles.capa} />
      ) : (
        <View style={[styles.capa, { backgroundColor: livro.cor_capa || "#8B5E3C" }]} />
      )}

      <Text style={styles.titulo}>{livro.titulo}</Text>
      {livro.categoria ? <Text style={styles.categoria}>{livro.categoria}</Text> : null}

      <Pressable style={styles.botao} onPress={() => router.push(`/livro/${id}/sumario`)}>
        <Text style={styles.botaoTexto}>Ler / Ver páginas</Text>
      </Pressable>

      <Pressable
        style={[styles.botao, styles.botaoSecundario]}
        onPress={() => router.push(`/livro/${id}/configuracoes`)}
      >
        <Text style={styles.botaoSecundarioTexto}>Configurações do livro</Text>
      </Pressable>

      <Pressable style={styles.botaoExcluir} onPress={excluirLivro}>
        <Text style={styles.botaoExcluirTexto}>Mover para o baú</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20, backgroundColor: "#FBF7F0" },
  capa: { width: 140, height: 190, borderRadius: 6, marginTop: 12 },
  titulo: { fontSize: 22, fontWeight: "bold", color: "#5A3E2B", marginTop: 16, textAlign: "center" },
  categoria: { color: "#8B5E3C", marginTop: 4 },
  botao: {
    backgroundColor: "#8B5E3C",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 24,
    width: "100%",
  },
  botaoTexto: { color: "#fff", fontWeight: "bold" },
  botaoSecundario: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#8B5E3C", marginTop: 12 },
  botaoSecundarioTexto: { color: "#8B5E3C", fontWeight: "bold" },
  botaoExcluir: { marginTop: 32 },
  botaoExcluirTexto: { color: "#8B3C3C" },
});
