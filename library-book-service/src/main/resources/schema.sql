-- Book Service Schema
CREATE TABLE IF NOT EXISTS books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    isbn VARCHAR(20) UNIQUE NOT NULL,
    description VARCHAR(2000),
    publication_date DATE,
    category VARCHAR(100),
    available_copies INT NOT NULL,
    total_copies INT NOT NULL,
    author_id BIGINT
);


