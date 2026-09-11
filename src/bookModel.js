// Formato de um livro no Firestore (coleção "livros"), reaproveitado do
// app web e estendido com "categoria" (usada pela busca externa e pela
// sugestão automática da IA).

export function criarLivroPadrao({ userId, titulo, corCapa, corPagina, corTexto, categoria }) {
  return {
    userId,
    titulo,
    categoria: categoria || null,
    cor_capa: corCapa,
    cor_pagina: corPagina,
    cor_texto: corTexto,
    capa_imagem: null,
    capa_cor_dominante: null,
    data_criacao: new Date().toISOString(),
    excluido: false,
  };
}

// Formato de uma página no Firestore (subcoleção "livros/{id}/paginas").
export function criarPaginaPadrao({ texto, imagem, ordem }) {
  return {
    texto: texto || "",
    imagem: imagem || null,
    ordem,
    resumo_ia: null,
  };
}
