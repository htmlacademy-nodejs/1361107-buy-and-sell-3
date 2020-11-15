DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS offer_types;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS offers;
DROP TABLE IF EXISTS offers_categories;
DROP TABLE IF EXISTS comments_offers;
DROP TABLE IF EXISTS comments_users;

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR (50) NOT NULL
);

CREATE UNIQUE INDEX categories_name_idx ON categories (name);

CREATE TABLE offer_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL
);

CREATE UNIQUE INDEX offer_types_name_idx ON offer_types (name);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  text VARCHAR (300) NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR (50) NOT NULL,
  lastname VARCHAR (50) NOT NULL,
  email VARCHAR (50) NOT NULL,
  password VARCHAR NOT NULL
);

CREATE UNIQUE INDEX users_email_idx ON users (email);

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

CREATE TABLE offers_categories (
  offer_id INTEGER,
  category_id INTEGER,
  CONSTRAINT offers_categories_pk PRIMARY KEY (offer_id, category_id),
  FOREIGN KEY (offer_id) REFERENCES offers (id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX offers_categories_offer_id_idx ON offers_categories (offer_id);

CREATE TABLE comments_offers (
  comment_id INTEGER,
  offer_id INTEGER,
  CONSTRAINT comments_offers_pk PRIMARY KEY (comment_id, offer_id),
  FOREIGN KEY (comment_id) REFERENCES comments (id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (offer_id) REFERENCES offers (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX comments_offers_comment_id_idx ON comments_offers (comment_id);
CREATE INDEX comments_offers_offer_id_idx ON comments_offers (offer_id);

CREATE TABLE comments_users (
  comment_id INTEGER,
  user_id INTEGER,
  CONSTRAINT comments_users_pk PRIMARY KEY (comment_id, user_id),
  FOREIGN KEY (comment_id) REFERENCES comments (id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX comments_users_comment_id_idx ON comments_users (comment_id);