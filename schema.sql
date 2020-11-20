DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS offer_types CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS offers_categories CASCADE;

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR (50) NOT NULL UNIQUE
);

CREATE TABLE offer_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR (50) NOT NULL,
  lastname VARCHAR (50) NOT NULL,
  email VARCHAR (50) NOT NULL UNIQUE,
  password VARCHAR NOT NULL
);

CREATE TABLE offers (
  id SERIAL PRIMARY KEY,
  title VARCHAR (50) NOT NULL,
  picture VARCHAR NOT NULL,
  type INTEGER NOT NULL,
  cost INTEGER NOT NULL,
  description VARCHAR (300) NOT NULL,
  owner INTEGER,
  created_date DATE NOT NULL,
  FOREIGN KEY (owner) REFERENCES users (id) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE,
  FOREIGN KEY (type) REFERENCES offer_types (id) 
    ON DELETE RESTRICT 
    ON UPDATE CASCADE
);

CREATE INDEX offers_title_idx ON offers (title);
CREATE INDEX offers_id_idx ON offers (id);
CREATE INDEX offers_type_idx ON offers (type);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  text VARCHAR (300) NOT NULL,
  user_id INTEGER,
  offer_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE,
  FOREIGN KEY (offer_id) REFERENCES offers (id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);

CREATE TABLE offers_categories (
  offer_id INTEGER,
  category_id INTEGER,
  CONSTRAINT offers_categories_pk PRIMARY KEY (offer_id, category_id),
  FOREIGN KEY (offer_id) REFERENCES offers (id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX offers_categories_offer_id_idx ON offers_categories (offer_id);