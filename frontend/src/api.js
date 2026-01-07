// src/api.js
import { getToken, clearToken } from "./auth";

// Wrapper fetch che aggiunge automaticamente l'header Authorization se presente il token.
// Lancia Error con un messaggio leggibile (se il backend ritorna { error } lo usa).
export async function apiFetch(url, options = {}) {
  const token = getToken();

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(url, { ...options, headers });

  // Se il token è scaduto o non valido, puliamo e lasciamo decidere al caller.
  if (res.status === 401) {
    clearToken();
  }

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  const payload = isJson
    ? await res.json().catch(() => null)
    : await res.text().catch(() => "");

  if (!res.ok) {
    const msg =
      (payload && typeof payload === "object" && payload.error) ||
      (typeof payload === "string" && payload) ||
      `Errore ${res.status}`;
    throw new Error(msg);
  }

  return payload;
}
