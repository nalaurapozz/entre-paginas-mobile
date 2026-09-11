# Modelagem de Dados

## Firestore (remoto)

```
usuarios (coleção)
└── {uid} (documento)
    ├── nome: string
    ├── email: string
    ├── avatar: string | null
    └── preferencias_notificacao: boolean

livros (coleção)
└── {livroId} (documento)
    ├── userId: string            → uid do dono do livro
    ├── titulo: string
    ├── categoria: string | null  → preenchida manualmente, pela busca externa ou pela IA
    ├── cor_capa: string          → cor hex, usada quando não há capa_imagem
    ├── cor_pagina: string
    ├── cor_texto: string
    ├── capa_imagem: string | null → uri da foto ou url importada do Google Books
    ├── capa_cor_dominante: string | null
    ├── data_criacao: string (ISO)
    ├── excluido: boolean          → true = movido pro "baú" (soft delete)
    │
    └── paginas (subcoleção)
        └── {paginaId} (documento)
            ├── texto: string
            ├── imagem: string | null  → uri da foto tirada pela câmera
            ├── ordem: number          → timestamp de criação, usado pra ordenar
            └── resumo_ia: string | null → cache do último resumo gerado
```

## AsyncStorage (local, por dispositivo)

| Chave                            | Conteúdo                                          |
|-----------------------------------|----------------------------------------------------|
| `@entrepaginas:ultimo_livro`      | id do último livro aberto (string)                 |
| `@entrepaginas:preferencias`      | `{ notificacoesAtivas: boolean }` (JSON)           |

## Relacionamentos

- Um usuário (`usuarios/{uid}`) tem vários livros (`livros` filtrados por `userId == uid`).
- Um livro tem várias páginas, guardadas como subcoleção (`livros/{id}/paginas`), o que permite consultar/paginar as páginas de um livro sem carregar as de outros livros.
