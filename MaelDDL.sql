-- Test Comment
CREATE TABLE Books( 
  book_id INT NOT NULL AUTO_INCREMENT UNIQUE,
  title VARCHAR(145) NOT NULL,
  call_num CHAR(6),
  quantity INT NOT NULL,
  PRIMARY KEY (book_id)
  ) ENGINE = InnoDB;

CREATE TABLE Genres (
  genre_id INT AUTO_INCREMENT NOT NULL,
  genre_name VARCHAR(45) NOT NULL,
  PRIMARY KEY (genre_id)
  ) ENGINE = InnoDB;

CREATE TABLE Authors(
  author_id INT AUTO_INCREMENT NOT NULL UNIQUE,
  author_name VARCHAR(45) NOT NULL,
  PRIMARY KEY (author_id),
  ) ENGINE = InnoDB;

INSERT INTO Books(book_id, title, call_num, qunatity)
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
