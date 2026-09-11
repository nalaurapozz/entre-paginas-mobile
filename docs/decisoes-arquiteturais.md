# Decisões Arquiteturais

## 1. Persistência híbrida: Firestore (remoto) + AsyncStorage (local)

**Decisão:** livros e páginas ficam no Firestore; preferências do usuário e o "último livro aberto" ficam no AsyncStorage.

**Por quê:** livros/páginas são o dado principal do usuário — precisam sincronizar entre sessões e sobreviver a reinstalação do app, então precisam estar na nuvem. Já preferências de UI (ex: notificações ativas) não têm por que gerar leitura/escrita remota toda hora — ficam local, com acesso instantâneo e sem custo de rede.

**Trade-off aceito:** preferências não sincronizam entre dispositivos diferentes do mesmo usuário — aceitável, porque são configurações de baixo impacto.

## 2. Autenticação real com persistência via `initializeAuth` + AsyncStorage

**Decisão:** usar Firebase Auth (email/senha) configurado com `initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })`, em vez do `getAuth` padrão (que não persiste sessão em React Native).

**Por quê:** é requisito explícito que o app "lembre" o usuário logado ao reabrir. Rotas privadas são protegidas centralmente no layout raiz (`app/_layout.jsx`) usando o estado de autenticação do `AuthContext`, em vez de cada tela verificar isso individualmente — evita duplicar lógica de proteção de rota em 7 telas diferentes.

## 3. Camada de IA isolada, com fallback obrigatório

**Decisão:** toda chamada à API do Gemini passa por um único módulo (`src/services/iaService.js`). As funções desse módulo nunca lançam exceção — qualquer falha (timeout, erro HTTP, resposta em formato inesperado, chave ausente) retorna `null`.

**Por quê:** é requisito explícito que a IA nunca impeça o uso do app. Centralizar essa lógica num único lugar (em vez de cada tela lidar com try/catch de IA na mão) garante que esse comportamento de fallback é consistente em todo o app, e facilita testar os cenários de falha (basta simular no serviço, não em cada tela).

## 4. Reaproveitamento do projeto Firebase existente

**Decisão:** o app mobile usa o mesmo projeto Firebase (`receitas-utf`) já usado pelo protótipo web anterior do "Entre Páginas", em vez de criar um projeto novo.

**Por quê:** evita recriar regras de segurança do zero e permite testar mais rápido, já que o projeto Firebase já estava configurado e validado. O modelo de dados (`bookModel.js`) foi conscientemente estendido (campo `categoria` adicionado) em vez de recriado, mantendo compatibilidade com o que já existia.
