// Camada única de acesso à IA generativa (Google Gemini).
//
// Decisão arquitetural: toda a app trata a IA como um "extra" opcional.
// As duas funções abaixo NUNCA lançam exceção — se a chave não estiver
// configurada, se der timeout, se a API retornar erro, ou se a resposta
// vier num formato inesperado, elas retornam `null` e quem chamou decide
// como avisar o usuário, sem travar nenhum fluxo de CRUD.

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";
const TIMEOUT_MS = 12000;

async function chamarGemini(prompt) {
  if (!GEMINI_API_KEY) {
    console.warn("EXPO_PUBLIC_GEMINI_API_KEY não configurada — IA desativada.");
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      console.warn("Gemini respondeu com erro HTTP:", response.status);
      return null;
    }

    const data = await response.json();
    const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (typeof texto !== "string" || texto.trim().length === 0) {
      console.warn("Gemini respondeu em formato inesperado:", data);
      return null;
    }

    return texto.trim();
  } catch (erro) {
    console.warn("Falha ao chamar a IA (timeout, rede ou erro inesperado):", erro?.message);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function resumirTexto(textoDaPagina) {
  if (!textoDaPagina || textoDaPagina.trim().length < 20) return null;

  const prompt =
    "Resuma o trecho de livro abaixo em até 3 frases curtas, em português, " +
    "sem introduções nem comentários extras, só o resumo:\n\n" +
    textoDaPagina;

  return chamarGemini(prompt);
}

export async function sugerirCategoria(tituloDoLivro, amostraDeTexto) {
  if (!tituloDoLivro) return null;

  const prompt =
    "Com base no título e num trecho de um livro, responda APENAS com uma " +
    "categoria/gênero literário curto (uma ou duas palavras, em português, " +
    "sem pontuação extra). Título: " +
    tituloDoLivro +
    "\nTrecho: " +
    (amostraDeTexto || "(sem trecho disponível)");

  const resposta = await chamarGemini(prompt);
  if (!resposta) return null;

  // Sanitiza: a IA às vezes devolve frase completa mesmo pedindo curto —
  // pegamos só a primeira linha/palavras pra não poluir a UI.
  const categoria = resposta.split("\n")[0].replace(/[.:"]/g, "").trim();
  return categoria.length > 0 && categoria.length <= 40 ? categoria : null;
}
