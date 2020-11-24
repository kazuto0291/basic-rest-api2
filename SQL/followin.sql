CREATE TABLE following (
  id INTEGER NOT NULL PRIMARY KEY,
  following_id INTEGER NOT NULL,
  followed_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
  updated_at TEXT NOT NULL DEFAULT (DATETIME('now', 'localtime')),
  FOREIGN KEY (following_id) references users(id),
  FOREIGN KEY (followed_id) references users(id)
);

INSERT INTO following
(following_id, followed_id)
VALUES
(1,2),
(1,3),
(1,4),
(2,1),
(2,3),
(3,4),
(4,3);

SELECT *
          FROM following as f
          LEFT JOIN users as u
          ON f.followed_id =u.id
          WHERE following_id = 1
          AND followed_id = 2

INSERT INTO following (following_id, followed_id) VALUES (1,15);