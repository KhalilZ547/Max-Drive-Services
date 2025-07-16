
-- This file contains the SQL schema for the application's database.
-- You can run this file in your MySQL client (like MySQL Workbench)
-- to set up the necessary tables.

-- Create the `clients` table to store user and admin information.
CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NULL,
    registered DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    role ENUM('client', 'admin') NOT NULL DEFAULT 'client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the `tuning_requests` table to store ECU tuning submissions.
CREATE TABLE tuning_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    vehicle VARCHAR(255) NOT NULL,
    service VARCHAR(255) NOT NULL,
    file_type ENUM('eeprom', 'flash', 'full_backup') NOT NULL,
    notes TEXT NULL,
    status ENUM('Pending', 'Awaiting Payment', 'Completed') NOT NULL DEFAULT 'Pending',
    price DECIMAL(10, 2) NULL,
    original_file_url VARCHAR(2048) NULL,
    modified_file_url VARCHAR(2048) NULL,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
);

-- Note on file URLs:
-- The `original_file_url` and `modified_file_url` columns are designed to store
-- the full URL to a file stored in a cloud service like Amazon S3. The application
-- handles the upload and stores the resulting URL here.
