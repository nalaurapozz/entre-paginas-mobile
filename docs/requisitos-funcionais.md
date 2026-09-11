# Requisitos Funcionais

## Autenticação
- RF01: O usuário deve poder criar uma conta com nome, email e senha.
- RF02: O usuário deve poder entrar com email e senha já cadastrados.
- RF03: A sessão deve persistir entre reinicializações do app (o usuário não precisa logar de novo toda vez que abre o app).
- RF04: Telas internas (estante, livro, páginas, perfil) só podem ser acessadas por um usuário autenticado.
- RF05: O usuário deve poder sair da conta (logout).

## Livros (CRUD)
- RF06: O usuário deve poder criar um livro manualmente (só título) ou importando dados de uma busca externa (Google Books).
- RF07: O usuário deve poder ver a lista de todos os seus livros ativos (estante).
- RF08: O usuário deve poder editar título, categoria e cor de capa de um livro.
- RF09: O usuário deve poder excluir (mover pro baú/arquivar) um livro.

## Páginas (CRUD)
- RF10: O usuário deve poder adicionar uma página a um livro, escrevendo texto e/ou tirando uma foto.
- RF11: O usuário deve poder ver a lista de páginas de um livro (sumário) e abrir cada uma para leitura.
- RF12: O usuário deve poder editar o texto/foto de uma página existente.
- RF13: O usuário deve poder excluir uma página.

## Recursos nativos
- RF14: O usuário deve poder tirar uma foto pela câmera do celular para anexar a uma página.
- RF15: Se a permissão de câmera for negada, o app deve continuar funcionando normalmente (sem foto), sem travar.
- RF16: O usuário deve poder ativar um lembrete diário de leitura (notificação local).
- RF17: Se a permissão de notificações for negada, o app deve avisar o usuário e manter a preferência desligada, sem travar.

## API externa
- RF18: O usuário deve poder buscar livros por título numa base pública (Google Books) para importar capa, categoria e sinopse.
- RF19: Se a API externa estiver fora do ar ou não retornar resultados, o usuário ainda deve poder criar o livro manualmente.

## IA generativa
- RF20: O usuário deve poder pedir um resumo automático do texto de uma página.
- RF21: O usuário deve poder pedir uma sugestão automática de categoria/gênero para um livro.
- RF22: Se a IA estiver indisponível, der timeout, erro, ou responder em formato inesperado, o app deve avisar o usuário e continuar funcionando normalmente (a IA nunca é obrigatória para usar o app).

## Armazenamento
- RF23: Livros e páginas devem ser salvos remotamente (Firestore), sincronizando entre sessões/dispositivos.
- RF24: Preferências do usuário (ex: notificações ativas) e o último livro aberto devem ser salvos localmente (AsyncStorage).
