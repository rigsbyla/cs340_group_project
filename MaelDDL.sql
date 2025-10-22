-- Test Comment
CREATE TABLE Books( 
  book_id INT NOT NULL AUTO_INCREMENT UNIQUE,
  title VARCHAR(145) NOT NULL,
  call_num CHAR(6),
  quantity INT NOT NULL,
  PRIMARY KEY (book_id)
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
