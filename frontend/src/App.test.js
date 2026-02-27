import { render, screen, fireEvent } from "@testing-library/react";
import AuthPage from "./components/AuthPage";

jest.mock("./api", () => ({
  apiFetch: jest.fn(),
}));

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

  test("mostra i bottoni Login e Register nello switch", () => {
    render(<AuthPage onAuthSuccess={mockOnAuthSuccess} />);
    // Ci sono due bottoni "Login": quello dello switch e quello del form
    // Verifica esistenza usando getAllByRole
    const loginButtons = screen.getAllByRole("button", { name: "Login" });
    expect(loginButtons.length).toBeGreaterThanOrEqual(1);
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