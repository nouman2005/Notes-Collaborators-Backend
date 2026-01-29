CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('admin','editor','viewer') DEFAULT 'editor',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT,
  title VARCHAR(255),
  content TEXT,
  is_public BOOLEAN DEFAULT false,
  share_token VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  note_id INT,
  action VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE collaborators (
  id INT AUTO_INCREMENT PRIMARY KEY,
  note_id INT,
  user_id INT,
  permission ENUM('editor','viewer'),
  FOREIGN KEY (note_id) REFERENCES notes(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
