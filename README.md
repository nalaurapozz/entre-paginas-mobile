# Entre Páginas (mobile)

App mobile de estante de livros digital pessoal — React Native + Expo. Projeto de faculdade (disciplina AI-first), construído com apoio do Claude Code. Veja o [diário de uso de IA](docs/diario-uso-ia.md) para detalhes de como a IA foi usada.

## Documentação

- [PRD](docs/PRD.md)
- [Requisitos funcionais](docs/requisitos-funcionais.md)
- [Escopo e fora de escopo](docs/escopo.md)
- [Decisões arquiteturais](docs/decisoes-arquiteturais.md)
- [Modelagem de dados](docs/modelagem-dados.md)
- [Diário de uso de IA](docs/diario-uso-ia.md)

## Como rodar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Copie `.env.example` para `.env` e coloque sua chave gratuita do Gemini (gere em https://aistudio.google.com/apikey):
   ```bash
   cp .env.example .env
   ```
3. Suba o servidor de desenvolvimento:
   ```bash
   npx expo start
   ```
4. Abra o app **Expo Go** no celular e escaneie o QR code que aparece no terminal.

## Stack

- React Native + Expo (Expo Router para navegação)
- Firebase Auth (email/senha) + Firestore (banco remoto)
- AsyncStorage (banco local)
- Google Books API (API externa)
- Google Gemini API (IA generativa: resumo de texto e sugestão de categoria)
- `expo-image-picker` (câmera) e `expo-notifications` (lembrete de leitura)
