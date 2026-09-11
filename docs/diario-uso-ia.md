# Diário de Uso de IA

Este projeto foi desenvolvido com apoio do Claude Code (Anthropic) como ferramenta de IA generativa para programação, conforme a disciplina é "AI-first". Este diário registra como a IA foi usada, quais decisões foram levadas pra usuária decidir, e o que precisa ser revisado por ela.

## 2026-09-11 — Da ideia original ao app mobile

**O que foi pedido:** havia um protótipo web anterior ("Entre Páginas" / pasta antiga "Aplicacao-Receitas"), feito em React + Vite, com o conceito de estante de livros pessoal. A tarefa da disciplina exige obrigatoriamente React Native + Expo — o protótipo web não atende esse requisito.

**O que a IA fez:**
1. Analisou o código do protótipo web existente (rotas, modelo de dados em `bookModel.js`, uso do Firebase) para entender a ideia original.
2. Comparou os requisitos da disciplina com o que já existia, identificando os pontos que faltavam: stack errada (web em vez de RN/Expo), falta de cadastro separado, falta de storage local, falta de API externa, falta de recurso nativo, falta de IA generativa, falta de toda a documentação e do repositório GitHub.
3. Apresentou esse gap de forma explícita antes de decidir qualquer coisa sozinha.

**Decisões que a IA perguntou pra usuária (não decidiu sozinha):**
- Recurso nativo a usar → usuária escolheu **câmera + notificações**.
- Funcionalidade de IA generativa → usuária escolheu **resumir página/capítulo + sugerir categoria**.
- Provedor de IA → usuária escolheu **Google Gemini API** (free tier, mais econômico para uso de estudante).
- Onde criar o projeto novo → usuária pediu para manter o app web antigo intacto e criar um projeto novo separado.

**Decisões técnicas que a IA tomou e justificou (a revisar com a usuária/professor):**
- Usar **Expo Router** em vez de configurar React Navigation manualmente — menos boilerplate, estrutura de pastas já organiza as rotas.
- Usar **email/senha** em vez de login Google no mobile, pra não lidar com a complexidade de OAuth nativo dentro do Expo Go.
- Reaproveitar o **mesmo projeto Firebase** (`receitas-utf`) do app web, em vez de criar um novo.
- Isolar toda chamada de IA num único serviço (`iaService.js`) que nunca lança erro — sempre retorna `null` em caso de falha, e cada tela decide como avisar o usuário.
- Usar `expo-image-picker` (em vez de `expo-camera` puro) para acionar a câmera nativa — mais simples de implementar mantendo o requisito de "recurso nativo: câmera" atendido.

**O que a usuária/grupo ainda precisa revisar:**
- Testar o app de ponta a ponta no celular via Expo Go e validar se o fluxo faz sentido na prática.
- Gerar a própria chave da Gemini API (gratuita) e configurar no arquivo `.env`.
- Criar o repositório no GitHub (a IA não tem acesso à conta do GitHub da usuária) e revisar o primeiro commit antes de enviar pro professor.
- Revisar o texto de todas as telas e a paleta de cores — foi feito um design funcional simples, não uma versão final de identidade visual.
