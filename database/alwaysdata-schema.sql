CREATE TABLE IF NOT EXISTS users (
    id_user INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NULL,
    role ENUM('user', 'admin', 'superadmin') NOT NULL DEFAULT 'user',
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_user),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS books (
    id_book INT NOT NULL AUTO_INCREMENT,
    id_user INT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    author VARCHAR(255) NULL,
    pdf_url TEXT NULL,
    public_id VARCHAR(255) NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_book),
    KEY idx_books_user (id_user),
    CONSTRAINT fk_books_user FOREIGN KEY (id_user) REFERENCES users(id_user)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS subscription (
    id_sub INT NOT NULL AUTO_INCREMENT,
    id_user INT NOT NULL,
    expiresAt DATE NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_sub),
    KEY idx_subscription_user (id_user),
    CONSTRAINT fk_subscription_user FOREIGN KEY (id_user) REFERENCES users(id_user)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS purchase (
    id_purchase INT NOT NULL AUTO_INCREMENT,
    id_user INT NOT NULL,
    id_book INT NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_purchase),
    KEY idx_purchase_user (id_user),
    KEY idx_purchase_book (id_book),
    CONSTRAINT fk_purchase_user FOREIGN KEY (id_user) REFERENCES users(id_user)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_purchase_book FOREIGN KEY (id_book) REFERENCES books(id_book)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
