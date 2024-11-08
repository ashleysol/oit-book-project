-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    username VARCHAR(45) NOT NULL, 
    email VARCHAR(100) NOT NULL, 
    password VARCHAR(45) NOT NULL 
);

--Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    content VARCHAR(45) NOT NULL, 
    status INT(1), 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
