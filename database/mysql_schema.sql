CREATE DATABASE sagip_manileno_db;
USE sagip_manileno_db;

CREATE TABLE `department` (
  `dept_id` int NOT NULL AUTO_INCREMENT,
  `dept_name` varchar(100) NOT NULL,
  `dept_type` varchar(50) DEFAULT NULL,
  `contact_no` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`dept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `contact_no` varchar(20) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `emergency_unit_admin` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `dept_id` int NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `contact_no` varchar(20) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `role` ENUM('ERU_ADMIN', 'SUBSTATION_ADMIN') NOT NULL DEFAULT 'SUBSTATION_ADMIN',
  PRIMARY KEY (`admin_id`),
  KEY `dept_id` (`dept_id`),
  CONSTRAINT `emergency_unit_admin_ibfk_1` FOREIGN KEY (`dept_id`) REFERENCES `department` (`dept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `responder` (
  `responder_id` int NOT NULL AUTO_INCREMENT,
  `dept_id` int NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `contact_no` varchar(20) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`responder_id`),
  KEY `dept_id` (`dept_id`),
  CONSTRAINT `responder_ibfk_1` FOREIGN KEY (`dept_id`) REFERENCES `department` (`dept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `incident` (
  `incident_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `incident_type` varchar(50) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `description` text,
  `reported_at` datetime DEFAULT NULL,
  `source` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`incident_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `incident_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `incident_assignment` (
  `assign_id` int NULL AUTO_INCREMENT,
  `incident_id` int NOT NULL,
  `responder_id` int DEFAULT NULL,
  `admin_id` int NULL,
  `assigned_at` datetime,
  `substation_id` int DEFAULT NULL,
  PRIMARY KEY (`assign_id`),
  KEY `incident_id` (`incident_id`),
  KEY `responder_id` (`responder_id`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `incident_assignment_ibfk_1` FOREIGN KEY (`incident_id`) REFERENCES `incident` (`incident_id`),
  CONSTRAINT `incident_assignment_ibfk_2` FOREIGN KEY (`responder_id`) REFERENCES `responder` (`responder_id`),
  CONSTRAINT `incident_assignment_ibfk_3` FOREIGN KEY (`admin_id`) REFERENCES `emergency_unit_admin` (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `incident_status` (
  `status_log_id` int NOT NULL AUTO_INCREMENT,
  `incident_id` int NOT NULL,
  `responder_id` int NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`status_log_id`),
  KEY `incident_id` (`incident_id`),
  KEY `responder_id` (`responder_id`),
  CONSTRAINT `incident_status_ibfk_1` FOREIGN KEY (`incident_id`) REFERENCES `incident` (`incident_id`),
  CONSTRAINT `incident_status_ibfk_2` FOREIGN KEY (`responder_id`) REFERENCES `responder` (`responder_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `offline_log` (
  `offlineLog_id` int NOT NULL AUTO_INCREMENT,
  `sender_no` varchar(20) DEFAULT NULL,
  `message_cont` text,
  `receive_at` datetime DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  PRIMARY KEY (`offlineLog_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `substation` (
  `substation_id` int NOT NULL AUTO_INCREMENT,
  `department_id` int NOT NULL,
  `substation_name` varchar(150) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`substation_id`),
  KEY `fk_substation_department` (`department_id`),
  CONSTRAINT `fk_substation_department` FOREIGN KEY (`department_id`) REFERENCES `department` (`dept_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


