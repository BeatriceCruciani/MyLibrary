/**
 * AuthPage — pagina di autenticazione.
 *
 * Gestisce:
 * - form di login e registrazione (mode switch)
 * - validazione minima lato client (email/password/nome)
 * - chiamate al backend (/api/auth/login, /api/auth/register)
 * - salvataggio token via setToken()
 * - notifica al parent (App) tramite onAuthSuccess(user)
 */
import { useMemo, useState } from "react";
import { apiFetch } from "../api";
import { setToken } from "../auth";

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ nome: "", email: "", password: "" });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Aggiorna i campi del form in modo generico usando name=""
  function updateField(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // Validazione email semplice
  const emailOk = useMemo(() => {
    const v = form.email.trim();
    return v.includes("@") && v.includes(".") && v.length >= 5;
  }, [form.email]);

  // backend: nome min 2, password min 6
  const nomeOk = useMemo(() => form.nome.trim().length >= 2, [form.nome]); // backend: min 2
  const passwordOk = useMemo(() => form.password.trim().length >= 6, [form.password]); // backend: min 6

  // Validazione complessiva: in register serve anche nome
  const isValid =
    mode === "register" ? nomeOk && emailOk && passwordOk : emailOk && passwordOk;


  /**
   * Submit:
   * - login: /api/auth/login
   * - register: /api/auth/register
   * Salva token e comunica al parent l'utente autenticato.
   */  
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const payload = await apiFetch("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({
            nome: form.nome.trim(),
            email: form.email.trim().toLowerCase(),
            password: form.password,
          }),
        });

        if (!payload?.token) throw new Error("Token non ricevuto dal server.");
        setToken(payload.token);

        const meRes = await apiFetch("/api/auth/me");
        onAuthSuccess(meRes.user); // ✅ backend ritorna { user }
      } else {
        const payload = await apiFetch("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({
            email: form.email.trim().toLowerCase(),
            password: form.password,
          }),
        });

        if (!payload?.token) throw new Error("Token non ricevuto dal server.");
        setToken(payload.token);

        const meRes = await apiFetch("/api/auth/me");
        onAuthSuccess(meRes.user); // ✅ backend ritorna { user }
      }
    } catch (err) {
      setError(err.message || "Errore di autenticazione");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>{mode === "login" ? "Accedi" : "Registrati"}</h2>

        <div className="auth-switch">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
            type="button"
          >
            Login
          </button>
          <button
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
            type="button"
          >
            Register
          </button>
        </div>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "register" && (
            <label>
              Nome
              <input
                name="nome"
                value={form.nome}
                onChange={updateField}
                placeholder="min 2 caratteri"
                autoComplete="name"
              />
            </label>
          )}

          <label>
            Email
            <input
              name="email"
              value={form.email}
              onChange={updateField}
              placeholder="es. nome@email.it"
              autoComplete="email"
            />
          </label>

          <label>
            Password
            <input
              name="password"
              value={form.password}
              onChange={updateField}
              placeholder="min 6 caratteri"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </label>

          <button disabled={!isValid || loading} className="primary">
            {loading ? "Attendere..." : mode === "login" ? "Login" : "Crea account"}
          </button>

          {!isValid && (
            <p className="hint">
              {mode === "register"
                ? "Nome (min 2), email valida, password (min 6)."
                : "Email valida e password (min 6)."}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
