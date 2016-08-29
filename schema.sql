DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  encrypted_password VARCHAR(255)
);

CREATE UNIQUE INDEX email ON users (email);

DROP TABLE IF EXISTS personal_tasks;

CREATE TABLE personal_tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  task VARCHAR(255) NOT NULL,
  sub_task VARCHAR(255),
  due_date TIMESTAMP NOT NULL DEFAULT now(),
  is_important BOOLEAN DEFAULT false
);

DROP TABLE IF EXISTS work_tasks;

CREATE TABLE work_tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  task VARCHAR(255) NOT NULL,
  sub_task VARCHAR(255),
  due_date TIMESTAMP NOT NULL DEFAULT now(),
  is_important BOOLEAN DEFAULT false
);
