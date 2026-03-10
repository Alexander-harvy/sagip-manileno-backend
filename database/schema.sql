CREATE TABLE responder (
    responder_id INT AUTO_INCREMENT PRIMARY KEY,
    dept_id INT NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    contact_no VARCHAR(20),

    FOREIGN KEY (dept_id) REFERENCES department(dept_id)
);