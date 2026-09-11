import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { useAuth } from "../src/context/AuthContext";

export default function Cadastro() {
  const { cadastrar } = useAuth();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleCadastrar() {
    if (!nome || !email || !senha) {
      Alert.alert("Preencha todos os campos.");
      return;
    }
    if (senha.length < 6) {
      Alert.alert("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    setEnviando(true);
    try {
      await cadastrar(nome.trim(), email.trim(), senha);
    } catch (erro) {
      Alert.alert("Não foi possível criar a conta", erro?.message || "Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Criar conta</Text>

      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
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
        placeholder="Senha (mínimo 6 caracteres)"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <Pressable style={styles.botao} onPress={handleCadastrar} disabled={enviando}>
        {enviando ? <ActivityIndicator color="#fff" /> : <Text style={styles.botaoTexto}>Cadastrar</Text>}
      </Pressable>

      <Link href="/login" style={styles.link}>
        Já tem conta? Entrar
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#FBF7F0" },
  titulo: { fontSize: 28, fontWeight: "bold", textAlign: "center", color: "#5A3E2B", marginBottom: 32 },
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
