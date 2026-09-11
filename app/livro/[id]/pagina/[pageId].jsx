import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { addDoc, collection, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../src/services/firebase";
import { criarPaginaPadrao } from "../../../../src/bookModel";
import { resumirTexto } from "../../../../src/services/iaService";

export default function PaginaDoLivro() {
  const { id, pageId } = useLocalSearchParams();
  const router = useRouter();
  const ehNova = pageId === "nova";

  const [texto, setTexto] = useState("");
  const [imagem, setImagem] = useState(null);
  const [resumo, setResumo] = useState(null);
  const [carregando, setCarregando] = useState(!ehNova);
  const [salvando, setSalvando] = useState(false);
  const [resumindo, setResumindo] = useState(false);

  useEffect(() => {
    if (ehNova) return;
    getDoc(doc(db, "livros", id, "paginas", pageId)).then((snap) => {
      if (snap.exists()) {
        const dados = snap.data();
        setTexto(dados.texto || "");
        setImagem(dados.imagem || null);
        setResumo(dados.resumo_ia || null);
      }
      setCarregando(false);
    });
  }, [id, pageId, ehNova]);

  async function tirarFoto() {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissao.granted) {
      // Recurso nativo negado: não travamos o fluxo, o usuário só não
      // consegue anexar foto e continua podendo escrever texto normalmente.
      Alert.alert(
        "Permissão da câmera negada",
        "Você pode continuar escrevendo a página sem foto, ou ativar a câmera depois nas configurações do celular."
      );
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({ quality: 0.5, base64: false });
    if (!resultado.canceled && resultado.assets?.[0]?.uri) {
      setImagem(resultado.assets[0].uri);
    }
  }

  async function handleResumir() {
    if (!texto || texto.trim().length < 20) {
      Alert.alert("Escreva um pouco mais de texto antes de pedir o resumo.");
      return;
    }
    setResumindo(true);
    const resultado = await resumirTexto(texto);
    setResumindo(false);

    if (!resultado) {
      Alert.alert(
        "IA indisponível no momento",
        "Não foi possível gerar o resumo agora (chave não configurada, sem internet ou serviço fora do ar). Você pode continuar usando o app normalmente."
      );
      return;
    }
    setResumo(resultado);
  }

  async function salvar() {
    setSalvando(true);
    try {
      if (ehNova) {
        await addDoc(collection(db, "livros", id, "paginas"), {
          ...criarPaginaPadrao({ texto, imagem, ordem: Date.now() }),
          resumo_ia: resumo,
        });
      } else {
        await updateDoc(doc(db, "livros", id, "paginas", pageId), { texto, imagem, resumo_ia: resumo });
      }
      router.back();
    } catch (erro) {
      Alert.alert("Não foi possível salvar", erro?.message);
    } finally {
      setSalvando(false);
    }
  }

  function excluirPagina() {
    Alert.alert("Excluir página", "Essa ação não pode ser desfeita.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "livros", id, "paginas", pageId));
          router.back();
        },
      },
    ]);
  }

  if (carregando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#8B5E3C" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {imagem ? <Image source={{ uri: imagem }} style={styles.imagem} /> : null}

      <Pressable style={styles.botaoSecundario} onPress={tirarFoto}>
        <Text style={styles.botaoSecundarioTexto}>{imagem ? "Trocar foto" : "Tirar foto da página"}</Text>
      </Pressable>

      <TextInput
        style={styles.textarea}
        placeholder="Escreva o texto da página..."
        multiline
        value={texto}
        onChangeText={setTexto}
      />

      <Pressable style={styles.botaoSecundario} onPress={handleResumir} disabled={resumindo}>
        {resumindo ? (
          <ActivityIndicator color="#8B5E3C" />
        ) : (
          <Text style={styles.botaoSecundarioTexto}>Resumir com IA</Text>
        )}
      </Pressable>

      {resumo ? (
        <View style={styles.caixaResumo}>
          <Text style={styles.resumoLabel}>Resumo gerado pela IA:</Text>
          <Text style={styles.resumoTexto}>{resumo}</Text>
        </View>
      ) : null}

      <Pressable style={styles.botao} onPress={salvar} disabled={salvando}>
        {salvando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Salvar</Text>}
      </Pressable>

      {!ehNova ? (
        <Pressable style={styles.botaoExcluir} onPress={excluirPagina}>
          <Text style={styles.botaoExcluirTexto}>Excluir página</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FBF7F0" },
  imagem: { width: "100%", height: 200, borderRadius: 8, marginBottom: 12 },
  textarea: {
    minHeight: 160,
    borderWidth: 1,
    borderColor: "#D9C7B0",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    textAlignVertical: "top",
    marginVertical: 12,
  },
  botaoSecundario: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#8B5E3C",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  botaoSecundarioTexto: { color: "#8B5E3C", fontWeight: "bold" },
  caixaResumo: { backgroundColor: "#F1E7D8", borderRadius: 8, padding: 12, marginTop: 12 },
  resumoLabel: { fontWeight: "bold", color: "#5A3E2B", marginBottom: 4 },
  resumoTexto: { color: "#5A3E2B" },
  botao: { backgroundColor: "#8B5E3C", borderRadius: 8, padding: 14, alignItems: "center", marginTop: 20 },
  botaoTexto: { color: "#fff", fontWeight: "bold" },
  botaoExcluir: { marginTop: 20, alignItems: "center", marginBottom: 20 },
  botaoExcluirTexto: { color: "#8B3C3C" },
});
