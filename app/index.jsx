import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Image } from "react-native";
import { Link, useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../src/services/firebase";
import { useAuth } from "../src/context/AuthContext";

export default function Estante() {
  const { usuario } = useAuth();
  const router = useRouter();
  const [livros, setLivros] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "livros"), where("userId", "==", usuario.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dados = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((livro) => !livro.excluido);
      setLivros(dados);
    });
    return unsubscribe;
  }, [usuario.uid]);

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <Link href="/perfil" style={styles.linkTopo}>
          Perfil
        </Link>
        <Link href="/buscar" style={styles.linkTopo}>
          + Adicionar livro
        </Link>
      </View>

      {livros.length === 0 ? (
        <Text style={styles.vazio}>
          Sua estante está vazia. Toque em "+ Adicionar livro" pra começar.
        </Text>
      ) : (
        <FlatList
          data={livros}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 12 }}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => router.push(`/livro/${item.id}`)}>
              {item.capa_imagem ? (
                <Image source={{ uri: item.capa_imagem }} style={styles.capa} />
              ) : (
                <View style={[styles.capa, { backgroundColor: item.cor_capa || "#8B5E3C" }]} />
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.tituloLivro}>{item.titulo}</Text>
                {item.categoria ? <Text style={styles.categoria}>{item.categoria}</Text> : null}
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#FBF7F0" },
  topo: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  linkTopo: { color: "#8B5E3C", fontWeight: "600" },
  vazio: { textAlign: "center", color: "#8B5E3C", marginTop: 60 },
  card: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  capa: { width: 48, height: 64, borderRadius: 4 },
  tituloLivro: { fontSize: 16, fontWeight: "bold", color: "#5A3E2B" },
  categoria: { fontSize: 12, color: "#8B5E3C", marginTop: 4 },
});
