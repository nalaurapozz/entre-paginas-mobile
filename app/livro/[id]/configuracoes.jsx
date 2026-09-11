import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, doc, getDoc, getDocs, limit, query, updateDoc } from "firebase/firestore";
import { db } from "../../../src/services/firebase";
import { sugerirCategoria } from "../../../src/services/iaService";

const CORES = ["#8B5E3C", "#3C6E8B", "#6E3C8B", "#3C8B5E", "#8B3C3C", "#B08968"];

export default function ConfiguracoesLivro() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [corCapa, setCorCapa] = useState(CORES[0]);
  const [carregando, setCarregando] = useState(true);
  const [sugerindo, setSugerindo] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "livros", id)).then((snap) => {
      if (snap.exists()) {
        const dados = snap.data();
        setTitulo(dados.titulo || "");
        setCategoria(dados.categoria || "");
        setCorCapa(dados.cor_capa || CORES[0]);
      }
      setCarregando(false);
    });
  }, [id]);

  async function handleSugerirCategoria() {
    setSugerindo(true);
    const primeiraPaginaSnap = await getDocs(query(collection(db, "livros", id, "paginas"), limit(1)));
    const amostra = primeiraPaginaSnap.docs[0]?.data()?.texto || "";
    const resultado = await sugerirCategoria(titulo, amostra);
    setSugerindo(false);

    if (!resultado) {
      Alert.alert(
        "IA indisponível no momento",
        "Não foi possível sugerir uma categoria agora. Você pode digitar manualmente."
      );
      return;
    }
    setCategoria(resultado);
  }

  async function salvar() {
    setSalvando(true);
    try {
      await updateDoc(doc(db, "livros", id), { titulo, categoria: categoria || null, cor_capa: corCapa });
      router.back();
    } catch (erro) {
      Alert.alert("Não foi possível salvar", erro?.message);
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#8B5E3C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} />

      <Text style={styles.label}>Categoria</Text>
      <View style={styles.linhaCategoria}>
        <TextInput style={[styles.input, { flex: 1 }]} value={categoria} onChangeText={setCategoria} />
        <Pressable style={styles.botaoSugerir} onPress={handleSugerirCategoria} disabled={sugerindo}>
          {sugerindo ? (
            <ActivityIndicator color="#8B5E3C" />
          ) : (
            <Text style={styles.botaoSugerirTexto}>Sugerir com IA</Text>
          )}
        </Pressable>
      </View>

      <Text style={styles.label}>Cor da capa</Text>
      <View style={styles.linhaCores}>
        {CORES.map((cor) => (
          <Pressable
            key={cor}
            style={[styles.corBola, { backgroundColor: cor }, corCapa === cor && styles.corSelecionada]}
            onPress={() => setCorCapa(cor)}
          />
        ))}
      </View>

      <Pressable style={styles.botao} onPress={salvar} disabled={salvando}>
        {salvando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Salvar</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FBF7F0" },
  label: { color: "#8B5E3C", fontWeight: "600", marginTop: 16, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#D9C7B0",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  linhaCategoria: { flexDirection: "row", gap: 8, alignItems: "center" },
  botaoSugerir: { paddingHorizontal: 10 },
  botaoSugerirTexto: { color: "#8B5E3C", fontWeight: "600", fontSize: 12 },
  linhaCores: { flexDirection: "row", gap: 12 },
  corBola: { width: 36, height: 36, borderRadius: 18 },
  corSelecionada: { borderWidth: 3, borderColor: "#5A3E2B" },
  botao: { backgroundColor: "#8B5E3C", borderRadius: 8, padding: 14, alignItems: "center", marginTop: 32 },
  botaoTexto: { color: "#fff", fontWeight: "bold" },
});
