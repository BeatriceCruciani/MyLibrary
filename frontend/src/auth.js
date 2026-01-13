/**
 * auth.js — gestione minimale del token JWT sul client.
 *
 * Scopo:
 * - salvare il token dopo login/register
 * - recuperarlo per inviarlo nelle richieste protette
 * - rimuoverlo in caso di logout o token non valido
 */
const TOKEN_KEY = "token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn() {
  return Boolean(getToken());
}
