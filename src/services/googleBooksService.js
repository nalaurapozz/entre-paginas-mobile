// API externa: Google Books (não exige chave para busca básica de volumes).

const TIMEOUT_MS = 10000;

export async function buscarLivros(termo) {
  if (!termo || termo.trim().length === 0) return [];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(termo)}&maxResults=15`;
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) return [];

    const data = await response.json();
    if (!Array.isArray(data?.items)) return [];

    return data.items.map((item) => {
      const info = item.volumeInfo || {};
      return {
        id: item.id,
        titulo: info.title || "Sem título",
        autores: Array.isArray(info.authors) ? info.authors.join(", ") : null,
        categoria: Array.isArray(info.categories) ? info.categories[0] : null,
        sinopse: info.description || null,
        capaUrl: info.imageLinks?.thumbnail || null,
      };
    });
  } catch {
    // API externa fora do ar não deve travar a criação manual de um livro.
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
}
