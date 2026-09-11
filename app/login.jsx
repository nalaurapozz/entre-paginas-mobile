import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "../src/context/AuthContext";

export default function Login() {
  const { entrar } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleEntrar() {
    if (!email || !senha) {
      Alert.alert("Preencha email e senha.");
      return;
    }
    setEnviando(true);
    try {
      await entrar(email.trim(), senha);
    } catch (erro) {
      Alert.alert("Não foi possível entrar", erro?.message || "Verifique suas credenciais.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Entre Páginas</Text>
      <Text style={styles.subtitulo}>Sua estante de livros digital</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <Pressable style={styles.botao} onPress={handleEntrar} disabled={enviando}>
        {enviando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Entrar</Text>}
      </Pressable>

      <Link href="/cadastro" style={styles.link}>
        Ainda não tem conta? Cadastre-se
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#FBF7F0" },
  titulo: { fontSize: 32, fontWeight: "bold", textAlign: "center", color: "#5A3E2B" },
  subtitulo: { textAlign: "center", color: "#8B5E3C", marginBottom: 32 },
  input: {
    borderWidth: 1,
    borderColor: "#D9C7B0",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  botao: {
    backgroundColor: "#8B5E3C",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },
  botaoTexto: { color: "#fff", fontWeight: "bold" },
  link: { textAlign: "center", marginTop: 20, color: "#8B5E3C" },
});
