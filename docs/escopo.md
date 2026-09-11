# Escopo

## Dentro do escopo

- App mobile em React Native + Expo, testável via Expo Go em dispositivo real.
- 9 telas: Login, Cadastro, Estante, Buscar Livro, Perfil, Detalhes do Livro, Sumário, Página (ler/criar/editar), Configurações do Livro.
- Autenticação real (Firebase Auth, email/senha) com sessão persistente e rotas privadas protegidas.
- CRUD completo de livros e de páginas, salvos no Firestore.
- Armazenamento local (AsyncStorage) para preferências e último livro aberto.
- Consumo da API externa Google Books para importar dados de um livro.
- Uso da câmera do celular para fotografar páginas/capas, com tratamento de permissão negada.
- Uso de notificações locais como lembrete de leitura, com tratamento de permissão negada.
- Funcionalidade de IA generativa (Google Gemini) para resumir texto e sugerir categoria, com fallback caso a IA falhe.
- Documentação do projeto (este conjunto de documentos) e repositório no GitHub.

## Fora do escopo

- Login social (Google/Facebook) no mobile — decidimos usar só email/senha para evitar a complexidade de configurar OAuth nativo dentro do Expo Go.
- Compartilhamento de livros entre usuários ou leitura colaborativa.
- Importação de arquivos PDF/EPUB (existia no protótipo web anterior, mas não é objetivo desta etapa do projeto mobile).
- Modo offline completo (o app precisa de internet para ler/salvar livros e páginas; só preferências ficam disponíveis offline).
- Publicação nas lojas (Google Play / App Store) — o app roda via Expo Go durante a disciplina.
- Testes automatizados e pipeline de CI/CD.
- Fluxo de "esqueci minha senha".
