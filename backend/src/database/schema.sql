-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS shipment_history CASCADE;
DROP TABLE IF EXISTS shipments CASCADE;
DROP TABLE IF EXISTS states CASCADE;
DROP TABLE IF EXISTS countries CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Countries table
CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(2) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- States table
CREATE TABLE IF NOT EXISTS states (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(10) NOT NULL,
  country_id INTEGER NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(code, country_id)
);

-- Shipments table
CREATE TABLE IF NOT EXISTS shipments (
  id SERIAL PRIMARY KEY,
  tracking_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Processing',
  
  -- Sender information
  sender_name VARCHAR(100) NOT NULL,
  sender_email VARCHAR(255),
  sender_phone VARCHAR(50),
  sender_address VARCHAR(255) NOT NULL,
  sender_city VARCHAR(100) NOT NULL,
  sender_state_id INTEGER REFERENCES states(id),
  sender_zip VARCHAR(20) NOT NULL,
  sender_country_id INTEGER NOT NULL REFERENCES countries(id),
  
  -- Recipient information
  recipient_name VARCHAR(100) NOT NULL,
  recipient_email VARCHAR(255),
  recipient_phone VARCHAR(50),
  recipient_address VARCHAR(255) NOT NULL,
  recipient_city VARCHAR(100) NOT NULL,
  recipient_state_id INTEGER REFERENCES states(id),
  recipient_zip VARCHAR(20) NOT NULL,
  recipient_country_id INTEGER NOT NULL REFERENCES countries(id),
  
  -- Package information
  weight DECIMAL(10, 2),
  dimensions VARCHAR(50),
  service VARCHAR(50),
  
  -- Dates
  estimated_delivery TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipment history table
CREATE TABLE IF NOT EXISTS shipment_history (
  id SERIAL PRIMARY KEY,
  shipment_id INTEGER NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  location VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipment_history_shipment_id ON shipment_history(shipment_id);
CREATE INDEX IF NOT EXISTS idx_states_country_id ON states(country_id);

-- Create update trigger for updated_at columns
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to all tables with updated_at
CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_countries_modtime
    BEFORE UPDATE ON countries
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_states_modtime
    BEFORE UPDATE ON states
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_shipments_modtime
    BEFORE UPDATE ON shipments
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();

