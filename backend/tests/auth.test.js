/**
 * tests/auth.test.js
 * Test delle route di autenticazione: POST /api/auth/register e POST /api/auth/login
 *
 * Il database viene sostituito da mock (jest.mock) per evitare
 * dipendenze esterne: i test girano senza MySQL.
 */

const request = require("supertest");

// Mock del modello User PRIMA di importare l'app
jest.mock("../src/models/user.model");
const User = require("../src/models/user.model");

// Mock di bcryptjs per controllare il comportamento nei test
jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password"),
  compare: jest.fn(),
}));
const bcrypt = require("bcryptjs");

process.env.JWT_SECRET = "test_secret_per_ci";

const app = require("../src/app");

// ──────────────────────────────────────────
// POST /api/auth/register
// ──────────────────────────────────────────
describe("POST /api/auth/register", () => {
  beforeEach(() => jest.clearAllMocks());

  test("registra un nuovo utente con dati validi → 201 + token", async () => {
    User.findByEmail.mockResolvedValue(null);       // email non già usata
    User.createUser.mockResolvedValue(1);           // restituisce il nuovo id

    const res = await request(app).post("/api/auth/register").send({
      nome: "Beatrice",
      email: "b@test.it",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toMatchObject({ email: "b@test.it" });
  });

  test("rifiuta se la email è già registrata → 409", async () => {
    User.findByEmail.mockResolvedValue({ id: 1, email: "b@test.it" });

    const res = await request(app).post("/api/auth/register").send({
      nome: "Beatrice",
      email: "b@test.it",
      password: "password123",
    });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty("error");
  });

  test("rifiuta se la password è troppo corta → 400", async () => {
    const res = await request(app).post("/api/auth/register").send({
      nome: "Beatrice",
      email: "b@test.it",
      password: "123",
    });

    expect(res.statusCode).toBe(400);
  });

  test("rifiuta se il nome è mancante → 400", async () => {
    const res = await request(app).post("/api/auth/register").send({
      nome: "",
      email: "b@test.it",
      password: "password123",
    });

    expect(res.statusCode).toBe(400);
  });
});

// ──────────────────────────────────────────
// POST /api/auth/login
// ──────────────────────────────────────────
describe("POST /api/auth/login", () => {
  beforeEach(() => jest.clearAllMocks());

  test("login con credenziali corrette → 200 + token", async () => {
    User.findByEmail.mockResolvedValue({
      id: 1,
      email: "b@test.it",
      nome: "Beatrice",
      password_hash: "hashed_password",
    });
    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app).post("/api/auth/login").send({
      email: "b@test.it",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("login con password errata → 401", async () => {
    User.findByEmail.mockResolvedValue({
      id: 1,
      email: "b@test.it",
      password_hash: "hashed_password",
    });
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app).post("/api/auth/login").send({
      email: "b@test.it",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
  });

  test("login con email inesistente → 401", async () => {
    User.findByEmail.mockResolvedValue(null);

    const res = await request(app).post("/api/auth/login").send({
      email: "nonesiste@test.it",
      password: "password123",
    });

    expect(res.statusCode).toBe(401);
  });
});