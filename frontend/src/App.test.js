/**
 * App.test.js — test del componente AuthPage
 *
 * Verifica il rendering e il comportamento base della pagina di autenticazione.
 * Le chiamate API vengono intercettate con jest.mock per evitare
 * dipendenze dal backend durante i test.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import AuthPage from "./components/AuthPage";

// Mock del modulo api per non fare chiamate HTTP reali
jest.mock("./api", () => ({
  apiFetch: jest.fn(),
}));

// Mock di auth.js per evitare accessi a localStorage
jest.mock("./auth", () => ({
  setToken: jest.fn(),
  getToken: jest.fn(() => null),
  clearToken: jest.fn(),
  isLoggedIn: jest.fn(() => false),
}));

describe("AuthPage", () => {
  const mockOnAuthSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("mostra i bottoni Login e Register", () => {
    render(<AuthPage onAuthSuccess={mockOnAuthSuccess} />);
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Register" })).toBeInTheDocument();
  });

  test("mostra i campi email e password nel form di login", () => {
    render(<AuthPage onAuthSuccess={mockOnAuthSuccess} />);
    expect(screen.getByPlaceholderText("es. nome@email.it")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("min 6 caratteri")).toBeInTheDocument();
  });

  test("il bottone di submit è disabilitato con campi vuoti", () => {
    render(<AuthPage onAuthSuccess={mockOnAuthSuccess} />);
    const submitButton = screen.getByText("Login", { selector: "button.primary" });
    expect(submitButton).toBeDisabled();
  });

  test("passando a Register appare il campo nome", () => {
    render(<AuthPage onAuthSuccess={mockOnAuthSuccess} />);
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(screen.getByPlaceholderText("min 2 caratteri")).toBeInTheDocument();
  });

  test("in modalità Register il bottone di submit diventa 'Crea account'", () => {
    render(<AuthPage onAuthSuccess={mockOnAuthSuccess} />);
    fireEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(screen.getByText("Crea account", { selector: "button.primary" })).toBeInTheDocument();
  });
});