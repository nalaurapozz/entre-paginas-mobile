import { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../../src/services/firebase";

export default function Sumario() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [paginas, setPaginas] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "livros", id, "paginas"), orderBy("ordem", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPaginas(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [id]);

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.botaoNova}
        onPress={() => router.push(`/livro/${id}/pagina/nova`)}
      >
        <Text style={styles.botaoNovaTexto}>+ Nova página</Text>
      </Pressable>

      {paginas.length === 0 ? (
        <Text style={styles.vazio}>Esse livro ainda não tem páginas.</Text>
      ) : (
        <FlatList
          data={paginas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 8, marginTop: 12 }}
          renderItem={({ item, index }) => (
            <Pressable
              style={styles.card}
              onPress={() => router.push(`/livro/${id}/pagina/${item.id}`)}
            >
              <Text style={styles.numero}>{index + 1}</Text>
              <Text style={styles.trecho} numberOfLines={2}>
                {item.texto || "(página sem texto — só imagem)"}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#FBF7F0" },
  botaoNova: {
    backgroundColor: "#8B5E3C",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  botaoNovaTexto: { color: "#fff", fontWeight: "bold" },
  vazio: { textAlign: "center", color: "#8B5E3C", marginTop: 40 },
  card: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  numero: { fontWeight: "bold", color: "#8B5E3C", width: 24 },
  trecho: { flex: 1, color: "#5A3E2B" },
});
