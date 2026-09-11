import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "../src/context/AuthContext";

function Navegacao() {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#8B5E3C" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Protected guard={!usuario}>
        <Stack.Screen name="login" options={{ title: "Entrar" }} />
        <Stack.Screen name="cadastro" options={{ title: "Criar conta" }} />
      </Stack.Protected>

      <Stack.Protected guard={!!usuario}>
        <Stack.Screen name="index" options={{ title: "Minha Estante" }} />
        <Stack.Screen name="buscar" options={{ title: "Buscar Livro" }} />
        <Stack.Screen name="perfil" options={{ title: "Perfil" }} />
        <Stack.Screen name="livro/[id]/index" options={{ title: "Detalhes do Livro" }} />
        <Stack.Screen name="livro/[id]/sumario" options={{ title: "Sumário" }} />
        <Stack.Screen name="livro/[id]/pagina/[pageId]" options={{ title: "Página" }} />
        <Stack.Screen name="livro/[id]/configuracoes" options={{ title: "Configurações do Livro" }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Navegacao />
    </AuthProvider>
  );
}
