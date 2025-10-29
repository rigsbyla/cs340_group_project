--Drop Tables

DROP TABLE IF EXISTS BookOrders;
DROP TABLE IF EXISTS BookAuthors;
DROP TABLE IF EXISTS BookGenres;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Members;
DROP TABLE IF EXISTS Books;
DROP TABLE IF EXISTS Authors;
DROP TABLE IF EXISTS Genres;

-- TABLES

CREATE TABLE Books( 
  book_id INT NOT NULL AUTO_INCREMENT UNIQUE,
  title VARCHAR(145) NOT NULL,
  call_num CHAR(6),
  quantity INT NOT NULL,
  PRIMARY KEY (book_id)
  ) ENGINE = InnoDB;

CREATE TABLE Genres (
  genre_id INT AUTO_INCREMENT NOT NULL UNIQUE,
  genre_name VARCHAR(45) NOT NULL,
  PRIMARY KEY (genre_id)
  ) ENGINE = InnoDB;


CREATE TABLE Authors(
  author_id INT AUTO_INCREMENT NOT NULL UNIQUE,
  author_name VARCHAR(45) NOT NULL,
  PRIMARY KEY (author_id)
  ) ENGINE = InnoDB;

CREATE TABLE Members(
  member_id INT AUTO_INCREMENT NOT NULL UNIQUE, 
  first_name VARCHAR(45) NOT NULL,
  last_name VARCHAR(45) NOT NULL,
  address VARCHAR(145) NOT NULL,
  email VARCHAR(145), 
  phone_number char(10),
  fee_total FLOAT NOT NULL,
  PRIMARY KEY (member_id)
);

CREATE TABLE Orders(
    order_id INT AUTO_INCREMENT NOT NULL UNIQUE, 
    member_id INT NOT NULL, 
    order_date DATE NOT NULL, 
    due_date DATE NOT NULL, 
    FOREIGN KEY (member_id) REFERENCES Members(member_id),
    PRIMARY KEY (order_id)
);

CREATE TABLE BookAuthors(
    book_author_id INT AUTO_INCREMENT NOT NULL UNIQUE, 
    book_id INT NOT NULL, 
    author_id INT NOT NULL, 
    FOREIGN KEY (book_id) REFERENCES Books(book_id), 
    FOREIGN KEY (author_id) REFERENCES Authors(author_id), 
    PRIMARY KEY (book_author_id)
);

CREATE TABLE BookGenres (
    book_genre_id INT AUTO_INCREMENT NOT NULL UNIQUE,
    book_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY (book_genre_id),
    FOREIGN KEY (book_id) REFERENCES Books(book_id),
    FOREIGN KEY (genre_id) REFERENCES Genres(genre_id)
) ENGINE = InnoDB;

CREATE TABLE BookOrders(
  book_order_id INT AUTO_INCREMENT NOT NULL UNIQUE,
  order_id INT NOT NULL,
  book_id INT NOT NULL,
  quantity INT NOT NULL,
  PRIMARY KEY (book_order_id),
  FOREIGN KEY (order_id) REFERENCES Orders(order_id),
  FOREIGN KEY (book_id) REFERENCES Books(book_id)
  ) ENGINE = InnoDB;

INSERT INTO Books(book_id, title, call_num, quantity)
VALUES 
  (1, 'The Rangers of the North: A New beginning', 'CF4362', 4),
  (2, 'The Rangers of the North: A Kingdom in Peril', 'CF4367', 5),
  (3, 'Plants of the Pacific North West', 'SC7839', 2),
  (4, 'Early Settelments of the Willamette Valley', 'HS3312', 2),
  (5, 'Introduction to Calculus', 'MT5721', 6),
  (6, 'Car Owners Guide for Toyota Corolla 2004', 'EG0082', 1),
  (7, 'Atlas of the World', 'GE4012', 2),
  (8, 'Dinosaurs!', 'SC552', 2);

INSERT INTO Genres(genre_id, genre_name)
VALUES
  (1, 'Fiction'),
  (2, 'Non Fiction'),
  (3, 'History'),
  (4, 'Reference'),
  (5, 'Textbook'),
  (6, 'Science Fiction'),
  (7, 'Music');

INSERT INTO Authors(author_id, author_name)
VALUES 
  (1, 'John Walton'),
  (2, 'Jessica Vanderbin'),
  (3, 'Alexandra Gobs'),
  (4, 'Romero Gonzales'),
  (5, 'Samuel Chen'),
  (6, 'Jackson Smith'),
  (7, 'Jeremiah Brown');

INSERT INTO Members (first_name, last_name, address, email, phone_number, fee_total)
VALUES 
  ("Bob", "Smith", "7962 Buckingham Drive, Corvallis, OR 97330", "bsmith@email.com", "5553425234", 0), 
  ("Harvey", "Simon", "29 Sherman Street, Corvallis, OR 97330", "hsimon@email.com", "5553483824", 3), 
  ("Sherry", "Kline", "410 Water Street, Suite 3, Corvallis, OR 97330", "skline@email.com", "5558654345", 1.75), 
  ("Armando", "North", "745 Winding Way, Corvallis, OR 97330", "anorth@email.com", "5552353493", 0), 
  ("Chelsea", "Lin", "97 York Street, Corvallis, OR 97333", "clin@email.com", "5552342434", 0);

INSERT INTO Orders (order_id, member_id, order_date, due_date)
VALUES
  (1, 2, '2025-10-01', '2025-10-11'),
  (2, 1, '2025-10-13', '2025-10-23'),
  (3, 2, '2025-10-15', '2025-10-25'),
  (4, 4, '2025-10-16', '2025-10-26'),
  (5, 5, '2025-10-17', '2025-10-27');

INSERT INTO BookAuthors (book_id, author_id)
VALUES
  (1,1),
  (2,1),
  (3,3),
  (4,4),
  (5,5),
  (6,6),
  (7,6),
  (7,7),
  (8,3);

INSERT INTO BookOrders(book_order_id, order_id, book_id, quantity)
VALUES
  (1, 1, 2, 1),
  (2, 1, 4, 1),
  (3, 2, 1, 3),
  (4, 3, 6, 1),
  (5, 3, 7, 2),
  (6, 3, 8, 1),
  (7, 4, 2, 1),
  (8, 5, 2, 1);

INSERT INTO BookGenres(book_genre_id, book_id, genre_id) 
VALUES
  (1, 1, 1),
  (2, 2, 1),
  (3, 3, 2),
  (4, 3, 4),
  (5, 4, 2),
  (6, 4, 4),
  (7, 5, 5),
  (8, 6, 3),
  (9, 7, 2),
  (10, 8, 3);
