-- Contiene database, tabelle e dati di esempio

-- Creazione database se non esiste
CREATE DATABASE IF NOT EXISTS mylibrary;

-- Seleziona il database
USE mylibrary;

-- Creazione tabelle
CREATE TABLE IF NOT EXISTS utenti (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50),
    email VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS libri (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titolo VARCHAR(100),
    autore VARCHAR(100),
    stato ENUM('da leggere','in lettura','letto') DEFAULT 'da leggere',
    utente_id INT,
    FOREIGN KEY (utente_id) REFERENCES utenti(id)
);

CREATE TABLE IF NOT EXISTS citazioni (
    id INT AUTO_INCREMENT PRIMARY KEY,
    testo TEXT,
    libro_id INT,
    FOREIGN KEY (libro_id) REFERENCES libri(id)
);

CREATE TABLE IF NOT EXISTS recensioni (
    id INT AUTO_INCREMENT PRIMARY KEY,
    testo TEXT,
    libro_id INT,
    FOREIGN KEY (libro_id) REFERENCES libri(id)
);

-- Utenti
INSERT INTO utenti (nome, email) VALUES 
('Alice Rossi', 'alice@example.com'),
('Marco Bianchi', 'marco@example.com');

-- Libri
INSERT INTO libri (titolo, autore, stato, utente_id) VALUES
('Il Signore degli Anelli', 'J.R.R. Tolkien', 'da leggere', 1),
('1984', 'George Orwell', 'in lettura', 2),
('Il Nome della Rosa', 'Umberto Eco', 'letto', 1);

-- Citazioni
INSERT INTO citazioni (testo, libro_id) VALUES
('Non tutti quelli che vagano sono persi.', 1),
('La libertà è la libertà di dire che due più due fa quattro.', 2);

-- Recensioni
INSERT INTO recensioni (testo, libro_id) VALUES
('Un capolavoro fantasy senza tempo.', 1),
('Un libro distopico che fa riflettere.', 2);

