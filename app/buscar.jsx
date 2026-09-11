import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../src/services/firebase";
import { useAuth } from "../src/context/AuthContext";
import { buscarLivros } from "../src/services/googleBooksService";
import { criarLivroPadrao } from "../src/bookModel";

const CORES = ["#8B5E3C", "#3C6E8B", "#6E3C8B", "#3C8B5E", "#8B3C3C"];

export default function Buscar() {
  const { usuario } = useAuth();
  const router = useRouter();
  const [termo, setTermo] = useState("");
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [criando, setCriando] = useState(false);

  async function handleBuscar() {
    setBuscando(true);
    const resultado = await buscarLivros(termo);
    setResultados(resultado);
    setBuscando(false);
    if (resultado.length === 0) {
      Alert.alert(
        "Nenhum resultado",
        "Não encontramos livros com esse termo (ou a API externa está indisponível). Você pode continuar e criar o livro manualmente."
      );
    }
  }

  async function criarLivroManual() {
    if (!termo.trim()) {
      Alert.alert("Digite um título para o livro.");
      return;
    }
    await criarLivro({ titulo: termo.trim(), categoria: null, capaUrl: null });
  }

  async function criarLivro({ titulo, categoria, capaUrl }) {
    setCriando(true);
    try {
      const corAleatoria = CORES[Math.floor(Math.random() * CORES.length)];
      const novoLivro = criarLivroPadrao({
        userId: usuario.uid,
        titulo,
        corCapa: corAleatoria,
        corPagina: "#FBF7F0",
        corTexto: "#3B2A1E",
        categoria,
      });
      if (capaUrl) novoLivro.capa_imagem = capaUrl;

      const ref = await addDoc(collection(db, "livros"), novoLivro);
      router.replace(`/livro/${ref.id}`);
    } catch (erro) {
      Alert.alert("Não foi possível criar o livro", erro?.message);
    } finally {
      setCriando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.ajuda}>
        Busque um livro na Google Books API pra importar capa e categoria automaticamente, ou
        digite um título e crie manualmente.
      </Text>
      <View style={styles.linhaBusca}>
        <TextInput
          style={styles.input}
          placeholder="Título do livro"
          value={termo}
          onChangeText={setTermo}
          onSubmitEditing={handleBuscar}
        />
        <Pressable style={styles.botaoBuscar} onPress={handleBuscar} disabled={buscando}>
          {buscando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Buscar</Text>}
        </Pressable>
      </View>

      <Pressable style={styles.criarManual} onPress={criarLivroManual} disabled={criando}>
        <Text style={styles.criarManualTexto}>Criar "{termo || "..."}" manualmente</Text>
      </Pressable>

      <FlatList
        data={resultados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 10, marginTop: 16 }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            disabled={criando}
            onPress={() =>
              criarLivro({ titulo: item.titulo, categoria: item.categoria, capaUrl: item.capaUrl })
            }
          >
            {item.capaUrl ? (
              <Image source={{ uri: item.capaUrl }} style={styles.capa} />
            ) : (
              <View style={[styles.capa, { backgroundColor: "#D9C7B0" }]} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.tituloLivro}>{item.titulo}</Text>
              {item.autores ? <Text style={styles.detalhe}>{item.autores}</Text> : null}
              {item.categoria ? <Text style={styles.detalhe}>{item.categoria}</Text> : null}
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#FBF7F0" },
  ajuda: { color: "#8B5E3C", marginBottom: 12 },
  linhaBusca: { flexDirection: "row", gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D9C7B0",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  botaoBuscar: {
    backgroundColor: "#8B5E3C",
    borderRadius: 8,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  botaoTexto: { color: "#fff", fontWeight: "bold" },
  criarManual: { marginTop: 12, alignSelf: "flex-start" },
  criarManualTexto: { color: "#8B5E3C", textDecorationLine: "underline" },
  card: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  capa: { width: 44, height: 60, borderRadius: 4 },
  tituloLivro: { fontWeight: "bold", color: "#5A3E2B" },
  detalhe: { fontSize: 12, color: "#8B5E3C" },
});
