DROP TABLE IF EXISTS "death_coordinates";
DROP TABLE IF EXISTS "high_scores";
DROP TABLE IF EXISTS "users";

CREATE TABLE "users" (
  id SERIAL PRIMARY KEY,
  user_name VARCHAR(20) NULL DEFAULT NULL,
  password VARCHAR NULL DEFAULT NULL,
  flaps INTEGER NULL DEFAULT NULL,
  deaths INTEGER NULL DEFAULT NULL
);


CREATE TABLE "high_scores" (
  id SERIAL PRIMARY KEY,
  score INTEGER NULL DEFAULT NULL,
  user_id INTEGER NULL DEFAULT NULL REFERENCES "users" ("id")
);

CREATE TABLE "death_coordinates" (
  id SERIAL PRIMARY KEY,
  x_pos INTEGER NULL DEFAULT NULL,
  y_pos INTEGER NULL DEFAULT NULL,
  user_id INTEGER NULL DEFAULT NULL REFERENCES "users" ("id")
);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE users ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE high_scores ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE death_coordinates ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO users (id,user_name,password,flaps,deaths) VALUES
-- ('','','','','');
-- INSERT INTO high_scores (id,score,user_id) VALUES
-- ('','','');
-- INSERT INTO death_coordinates (id,x_pos,y_pos,user_id) VALUES
-- ('','','','');
