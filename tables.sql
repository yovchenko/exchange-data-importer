-- Create the country table
CREATE TABLE IF NOT EXISTS country (
  code VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255)
);

-- Create the exchange_office table
CREATE TABLE IF NOT EXISTS exchange_office (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255),
  country_code VARCHAR(255),
  FOREIGN KEY (country_code) REFERENCES country (code)
);

-- Create the rate table
CREATE TABLE IF NOT EXISTS rate (
  id SERIAL PRIMARY KEY,
  exchange_office_id VARCHAR(255),
  from_currency VARCHAR(255),
  to_currency VARCHAR(255),
  in_rate NUMERIC,
  out_rate NUMERIC,
  reserve INT,
  date DATE,
  FOREIGN KEY (exchange_office_id) REFERENCES exchange_office (id)
);

-- Create the exchange table
CREATE TABLE IF NOT EXISTS exchange (
  id SERIAL PRIMARY KEY,
  exchange_office_id VARCHAR(255),
  from_currency VARCHAR(255),
  to_currency VARCHAR(255),
  ask NUMERIC,
  date DATE,
  FOREIGN KEY (exchange_office_id) REFERENCES exchange_office (id)
);


