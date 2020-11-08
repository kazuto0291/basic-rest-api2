CREATE TABLE users (
  id INTEGER NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  profile TEXT,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
  date_of_birth TEXT
);

INSERT INTO users (name, profile) VALUES ("Subaru","エミリアたんマジ天使！");
INSERT INTO users (name, profile) VALUES ("Emilia", "もう、スバルのおたんこなす！");
INSERT INTO users (name, profile) VALUES ("Ram", "いいえお客様、きっと生まれてきたのが間違いだわ");
INSERT INTO users (name, profile) VALUES ("Rem", "はい、スバルくんのレムです。");
INSERT INTO users (name, profile) VALUES ("Roswaal", "君は私にな-兄を望むのかな?");