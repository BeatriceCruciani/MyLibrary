/**
 * api.js — wrapper centralizzato per chiamare il backend.
 *
 * Scopo:
 * - aggiungere automaticamente Authorization: Bearer <token> se presente
 * - gestire parsing JSON o testo
 * - trasformare gli errori HTTP in Error con messaggio leggibile
 * - se arriva 401 (non autorizzato) pulisce il token (logout “automatico”)
 */
import { getToken, clearToken } from "./auth";

// Wrapper fetch che aggiunge automaticamente l'header Authorization se presente il token.
// Lancia Error con un messaggio leggibile (se il backend ritorna { error } lo usa).
export async function apiFetch(url, options = {}) {
  const token = getToken();

  // Headers: partiamo da eventuali headers passati e li normalizziamo
  const headers = new Headers(options.headers || {});
  // Se c'è un body e non è stato impostato Content-Type, assumiamo JSON
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  // Se abbiamo un token, lo aggiungiamo come Bearer token (JWT)
  if (token) headers.set("Authorization", `Bearer ${token}`);

  // Esegue la richiesta HTTP con eventuali opzioni (method, body, ecc.)
  const res = await fetch(url, { ...options, headers });

  // Se il token è scaduto o non valido, puliamo e lasciamo decidere al caller.
  if (res.status === 401) {
    clearToken();
  }

  // Parsing risposta: se JSON -> res.json(), altrimenti res.text()
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  const payload = isJson
    ? await res.json().catch(() => null)
    : await res.text().catch(() => "");

    // Se status non OK, costruisce un messaggio
  if (!res.ok) {
    const msg =
      (payload && typeof payload === "object" && payload.error) ||
      (typeof payload === "string" && payload) ||
      `Errore ${res.status}`;
    throw new Error(msg);
  }

  return payload;
}
