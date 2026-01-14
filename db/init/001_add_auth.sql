USE mylibrary;

-- aggiungo la password (temporaneamente NULL)
ALTER TABLE utenti
  ADD COLUMN password_hash VARCHAR(255) NULL;

-- imposto una password di default agli utenti esistenti
-- password = password123
UPDATE utenti
SET password_hash = '$2b$10$d6i8G8DjQHV4nc26TSFUROAXmyKGIcBokI5Y/.oAt4aj3QwBumEpm'
WHERE id > 0;

-- rendo la password obbligatoria
ALTER TABLE utenti
  MODIFY password_hash VARCHAR(255) NOT NULL;

-- email unica
ALTER TABLE utenti
  ADD UNIQUE (email);

DESCRIBE utenti;

