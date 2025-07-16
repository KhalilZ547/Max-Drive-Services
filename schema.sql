-- This file contains the SQL schema for the Max-Drive-Services application.
-- Run this file in your MySQL database to set up the necessary tables.

-- 1. Create the 'clients' table
-- This table stores all user accounts, including clients and administrators.

CREATE TABLE `clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `registered` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `role` enum('client','admin') NOT NULL DEFAULT 'client',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 2. Create the 'tuning_requests' table
-- This table stores all ECU tuning requests submitted through the form.

CREATE TABLE `tuning_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_id` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `vehicle` varchar(255) NOT NULL,
  `service` varchar(255) NOT NULL,
  `file_type` enum('eeprom','flash','full_backup') NOT NULL,
  `notes` text,
  `status` enum('Pending','Awaiting Payment','Completed') NOT NULL DEFAULT 'Pending',
  `price` decimal(10,2) DEFAULT NULL,
  `original_file_url` varchar(2048) DEFAULT NULL,
  `modified_file_url` varchar(2048) DEFAULT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `tuning_requests_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- After creating the tables, you can manually create an admin user for yourself like this:
-- INSERT INTO clients (name, email, password, role) VALUES ('Your Name', 'admin@maxdrive.com', 'your_hashed_password', 'admin');
-- Note: You should generate a secure hash for your password, not store it as plain text.
