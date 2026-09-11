const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Necessário para o Firebase Auth (v12) resolver corretamente os módulos
// de persistência em React Native/Expo — sem isso o Metro tenta usar a
// versão "web" do pacote e a autenticação quebra em runtime.
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
