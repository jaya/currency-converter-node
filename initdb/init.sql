CREATE TABLE currency_converter_user (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

INSERT INTO currency_converter_user (name)
VALUES ('Agner Souza Bezerra');

CREATE TABLE currency_converter_transaction (
  transaction_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  from_currency CHAR(3) NOT NULL,
  to_currency CHAR(3) NOT NULL,
  from_value NUMERIC(15, 2) NOT NULL,
  to_value NUMERIC(15, 2) NOT NULL,
  rate NUMERIC(10, 6) NOT NULL,
  transaction_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_user
  FOREIGN KEY (user_id)
  REFERENCES currency_converter_user(id)
  ON DELETE RESTRICT
);
CREATE INDEX idx_currency_transaction_user ON currency_converter_transaction(user_id);

CREATE INDEX idx_currency_transaction_timestamp ON currency_converter_transaction(transaction_timestamp);
