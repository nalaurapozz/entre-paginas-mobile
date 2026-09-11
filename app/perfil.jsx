import { useEffect, useState } from "react";
import { View, Text, Switch, Pressable, StyleSheet, Alert, Linking } from "react-native";
import * as Notifications from "expo-notifications";
import { useAuth } from "../src/context/AuthContext";
import { obterPreferencias, salvarPreferencias } from "../src/storage/localStorage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Perfil() {
  const { usuario, sair } = useAuth();
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(false);

  useEffect(() => {
    obterPreferencias().then((prefs) => setNotificacoesAtivas(prefs.notificacoesAtivas));
  }, []);

  async function alternarNotificacoes(valor) {
    if (!valor) {
      await Notifications.cancelAllScheduledNotificationsAsync();
      setNotificacoesAtivas(false);
      await salvarPreferencias({ notificacoesAtivas: false });
      return;
    }

    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      // Recurso nativo negado: o app continua funcionando normalmente,
      // só avisamos o usuário e deixamos o toggle desligado.
      Alert.alert(
        "Permissão negada",
        "Você negou a permissão de notificações. Pode ativar depois nas configurações do celular.",
        [
          { text: "Fechar", style: "cancel" },
          { text: "Abrir configurações", onPress: () => Linking.openSettings() },
        ]
      );
      setNotificacoesAtivas(false);
      await salvarPreferencias({ notificacoesAtivas: false });
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Entre Páginas",
        body: "Que tal continuar a leitura de um dos seus livros hoje?",
      },
      trigger: { hour: 19, minute: 0, repeats: true },
    });

    setNotificacoesAtivas(true);
    await salvarPreferencias({ notificacoesAtivas: true });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.email}>{usuario?.email}</Text>

      <View style={styles.linha}>
        <Text style={styles.label}>Lembrete diário de leitura</Text>
        <Switch value={notificacoesAtivas} onValueChange={alternarNotificacoes} />
      </View>

      <Pressable style={styles.botaoSair} onPress={sair}>
        <Text style={styles.botaoSairTexto}>Sair da conta</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FBF7F0" },
  email: { fontSize: 16, color: "#5A3E2B", marginBottom: 24 },
  linha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
  },
  label: { color: "#5A3E2B", flex: 1, marginRight: 12 },
  botaoSair: { marginTop: 40, alignItems: "center" },
  botaoSairTexto: { color: "#8B3C3C", fontWeight: "bold" },
});
