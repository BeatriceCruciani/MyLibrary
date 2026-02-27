/**
 * tests/books.test.js
 * Test delle route principali di /api/books.
 *
 * Le rotte protette richiedono un JWT valido nell'header Authorization.
 * Il modello Book viene mockato per evitare dipendenze dal database.
 */

const request = require("supertest");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = "test_secret_per_ci";

// Mock del modello Book PRIMA di importare l'app
jest.mock("../src/models/bookModel");
const Book = require("../src/models/bookModel");

const app = require("../src/app");

// Token JWT valido per i test di rotte protette
const validToken = jwt.sign(
  { id: 1, email: "b@test.it" },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

// ──────────────────────────────────────────
// GET /api/books  (pubblica)
// ──────────────────────────────────────────
describe("GET /api/books", () => {
  beforeEach(() => jest.clearAllMocks());

  test("restituisce lista libri → 200 + array", async () => {
    Book.findAll.mockResolvedValue([
      { id: 1, titolo: "Il nome della rosa", autore: "Eco" },
      { id: 2, titolo: "1984", autore: "Orwell" },
    ]);

    const res = await request(app).get("/api/books");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
  });

  test("restituisce array vuoto se non ci sono libri → 200", async () => {
    Book.findAll.mockResolvedValue([]);

    const res = await request(app).get("/api/books");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});

// ──────────────────────────────────────────
// GET /api/books/:id  (pubblica)
// ──────────────────────────────────────────
describe("GET /api/books/:id", () => {
  beforeEach(() => jest.clearAllMocks());

  test("restituisce il libro se trovato → 200", async () => {
    Book.findById.mockResolvedValue({ id: 1, titolo: "Il nome della rosa", autore: "Eco" });

    const res = await request(app).get("/api/books/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("titolo", "Il nome della rosa");
  });

  test("restituisce 404 se il libro non esiste", async () => {
    Book.findById.mockResolvedValue(null);

    const res = await request(app).get("/api/books/999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
  });
});

// ──────────────────────────────────────────
// GET /api/books/me/mine  (protetta)
// ──────────────────────────────────────────
describe("GET /api/books/me/mine", () => {
  beforeEach(() => jest.clearAllMocks());

  test("restituisce i libri dell'utente con token valido → 200", async () => {
    Book.findAllByUser.mockResolvedValue([
      { id: 1, titolo: "Il nome della rosa", utente_id: 1 },
    ]);

    const res = await request(app)
      .get("/api/books/me/mine")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("rifiuta la richiesta senza token → 401", async () => {
    const res = await request(app).get("/api/books/me/mine");

    expect(res.statusCode).toBe(401);
  });
});

// ──────────────────────────────────────────
// POST /api/books  (protetta)
// ──────────────────────────────────────────
describe("POST /api/books", () => {
  beforeEach(() => jest.clearAllMocks());

  test("crea un libro con dati validi e token → 201", async () => {
    Book.create.mockResolvedValue({
      id: 10,
      titolo: "Dune",
      autore: "Herbert",
      stato: "da leggere",
      utente_id: 1,
    });

    const res = await request(app)
      .post("/api/books")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ titolo: "Dune", autore: "Herbert", stato: "da leggere" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  test("rifiuta la creazione senza token → 401", async () => {
    const res = await request(app)
      .post("/api/books")
      .send({ titolo: "Dune", autore: "Herbert", stato: "da leggere" });

    expect(res.statusCode).toBe(401);
  });
});