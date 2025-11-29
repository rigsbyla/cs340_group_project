DROP PROCEDURE delete_book;
CREATE DEFINER=`cs340_rigsbyla`@`%` PROCEDURE `delete_book`(delete_book_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
    ROLLBACK;
    SELECT 'Error! Book not deleted.' AS Result;
    END;
    START TRANSACTION;
    DELETE FROM Books WHERE book_id = delete_book_id;
    COMMIT;
    SELECT 'Member deleted successfully.' AS Result;


END

DROP PROCEDURE delete_book_order;
CREATE DEFINER=`cs340_rigsbyla`@`%` PROCEDURE `delete_book_order`(delete_book_order_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
    ROLLBACK;
    SELECT 'Error! Order not deleted.' AS Result;
    END;
    START TRANSACTION;
    DELETE FROM BookOrders WHERE book_order_id = delete_book_order_id;
    COMMIT;
    SELECT 'Order deleted successfully.' AS Result;


END


DROP PROCEDURE delete_member;
CREATE DEFINER=`cs340_rigsbyla`@`%` PROCEDURE `delete_member`(delete_member_id INT)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
    ROLLBACK;
    SELECT 'Error! Member not deleted.' AS Result;
    END;
    START TRANSACTION;
    DELETE FROM Members WHERE member_id = delete_member_id;
    COMMIT;
    SELECT 'Member deleted successfully.' AS Result;
END


DROP PROCEDURE add_book_with_author_genre;
CREATE DEFINER=`cs340_rigsbyla`@`%` PROCEDURE `add_book_with_author_genre`(
    IN  p_title       VARCHAR(145),
    IN  p_call_num    CHAR(6),
    IN  p_quantity    INT,
    IN  p_author_name VARCHAR(45),
    IN  p_genre_name  VARCHAR(45)
)
BEGIN
    DECLARE v_author_id INT;
    DECLARE v_genre_id  INT;

    -- Look up author; create if not found
    SELECT author_id
      INTO v_author_id
      FROM Authors
     WHERE author_name = p_author_name
     LIMIT 1;

    IF v_author_id IS NULL THEN
        INSERT INTO Authors (author_name)
        VALUES (p_author_name);
        SET v_author_id = LAST_INSERT_ID();
    END IF;

    -- Look up genre; create if not found
    SELECT genre_id
      INTO v_genre_id
      FROM Genres
     WHERE genre_name = p_genre_name
     LIMIT 1;

    IF v_genre_id IS NULL THEN
        INSERT INTO Genres (genre_name)
        VALUES (p_genre_name);
        SET v_genre_id = LAST_INSERT_ID();
    END IF;

    -- Create the new book
    INSERT INTO Books (title, call_num, quantity)
    VALUES (p_title, p_call_num, p_quantity);

    SET @new_book_id = LAST_INSERT_ID();

    -- Link book to author
    INSERT INTO BookAuthors (book_id, author_id)
    VALUES (@new_book_id, v_author_id);

    -- Link book to genre
    INSERT INTO BookGenres (book_id, genre_id)
    VALUES (@new_book_id, v_genre_id);
END

DROP PROCEDURE load_librarydb;
CREATE DEFINER=`cs340_rigsbyla`@`%` PROCEDURE `load_librarydb`()
BEGIN
  -- Make sure we’re operating on this schema (optional, but helpful)
  -- USE your_database_name;

  -- Disable FK checks so drops don’t fail
  SET FOREIGN_KEY_CHECKS = 0;

  -- Drop tables (order doesn’t matter while FK checks are off)
  DROP TABLE IF EXISTS BookOrders;
  DROP TABLE IF EXISTS BookAuthors;
  DROP TABLE IF EXISTS BookGenres;
  DROP TABLE IF EXISTS Orders;
  DROP TABLE IF EXISTS Members;
  DROP TABLE IF EXISTS Books;
  DROP TABLE IF EXISTS Authors;
  DROP TABLE IF EXISTS Genres;

  SET FOREIGN_KEY_CHECKS = 1;

  -- TABLES

  CREATE TABLE Books( 
    book_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(145) NOT NULL,
    call_num CHAR(6),
    quantity INT NOT NULL,
    PRIMARY KEY (book_id)
  ) ENGINE=InnoDB;

  CREATE TABLE Genres (
    genre_id INT NOT NULL AUTO_INCREMENT,
    genre_name VARCHAR(45) NOT NULL,
    PRIMARY KEY (genre_id)
  ) ENGINE=InnoDB;

  CREATE TABLE Authors(
    author_id INT NOT NULL AUTO_INCREMENT,
    author_name VARCHAR(45) NOT NULL,
    PRIMARY KEY (author_id)
  ) ENGINE=InnoDB;

  CREATE TABLE Members(
    member_id INT NOT NULL AUTO_INCREMENT, 
    first_name VARCHAR(45) NOT NULL,
    last_name  VARCHAR(45) NOT NULL,
    address    VARCHAR(145) NOT NULL,
    email      VARCHAR(145), 
    phone_number VARCHAR(15),
    fee_total  FLOAT NOT NULL DEFAULT 0,
    PRIMARY KEY (member_id)
  ) ENGINE=InnoDB;

  -- member_id NULL so ON DELETE SET NULL is valid
  CREATE TABLE Orders(
    order_id   INT NOT NULL AUTO_INCREMENT, 
    member_id  INT NULL, 
    order_date DATE NOT NULL, 
    due_date   DATE NOT NULL, 
    PRIMARY KEY (order_id),
    CONSTRAINT fk_orders_member
      FOREIGN KEY (member_id) REFERENCES Members(member_id)
      ON DELETE SET NULL ON UPDATE CASCADE
  ) ENGINE=InnoDB;

  -- Make FK columns NULL so SET NULL works (though CASCADE is more common on link tables)
  CREATE TABLE BookAuthors(
    book_author_id INT NOT NULL AUTO_INCREMENT, 
    book_id   INT NULL, 
    author_id INT NULL, 
    PRIMARY KEY (book_author_id),
    CONSTRAINT fk_ba_book
      FOREIGN KEY (book_id)   REFERENCES Books(book_id)
      ON DELETE SET NULL ON UPDATE CASCADE, 
    CONSTRAINT fk_ba_author
      FOREIGN KEY (author_id) REFERENCES Authors(author_id)
      ON DELETE SET NULL ON UPDATE CASCADE
  ) ENGINE=InnoDB;

  CREATE TABLE BookGenres (
    book_genre_id INT NOT NULL AUTO_INCREMENT,
    book_id  INT NULL,
    genre_id INT NULL,
    PRIMARY KEY (book_genre_id),
    CONSTRAINT fk_bg_book
      FOREIGN KEY (book_id)  REFERENCES Books(book_id)
      ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_bg_genre
      FOREIGN KEY (genre_id) REFERENCES Genres(genre_id)
      ON DELETE SET NULL ON UPDATE CASCADE
  ) ENGINE=InnoDB;

  CREATE TABLE BookOrders(
    book_order_id INT NOT NULL AUTO_INCREMENT,
    order_id INT NULL,
    book_id  INT NULL,
    quantity INT NOT NULL,
    PRIMARY KEY (book_order_id),
    CONSTRAINT fk_bo_order
      FOREIGN KEY (order_id) REFERENCES Orders(order_id)
      ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_bo_book
      FOREIGN KEY (book_id)  REFERENCES Books(book_id)
      ON DELETE SET NULL ON UPDATE CASCADE
  ) ENGINE=InnoDB;

  -- DATA
  INSERT INTO Books (book_id, title, call_num, quantity) VALUES
    (1,'The Rangers of the North: A New beginning','CF4362',4),
    (2,'The Rangers of the North: A Kingdom in Peril','CF4367',5),
    (3,'Plants of the Pacific North West','SC7839',2),
    (4,'Early Settlments of the Willamette Valley','HS3312',2),
    (5,'Introduction to Calculus','MT5721',6),
    (6,'Car Owners Guide for Toyota Corolla 2004','EG0082',1),
    (7,'Atlas of the World','GE4012',2),
    (8,'Dinosaurs!','SC5520',2);

  INSERT INTO Genres (genre_id, genre_name) VALUES
    (1,'Fiction'),(2,'Non Fiction'),(3,'History'),
    (4,'Reference'),(5,'Textbook'),(6,'Science Fiction'),(7,'Music');

  INSERT INTO Authors (author_id, author_name) VALUES 
    (1,'John Walton'),(2,'Jessica Vanderbin'),(3,'Alexandra Gobs'),
    (4,'Romero Gonzales'),(5,'Samuel Chen'),(6,'Jackson Smith'),(7,'Jeremiah Brown');

  INSERT INTO Members (first_name,last_name,address,email,phone_number,fee_total) VALUES 
    ('Bob','Smith','7962 Buckingham Drive, Corvallis, OR 97330','bsmith@email.com','5553425234',0), 
    ('Harvey','Simon','29 Sherman Street, Corvallis, OR 97330','hsimon@email.com','5553483824',3), 
    ('Sherry','Kline','410 Water Street, Suite 3, Corvallis, OR 97330','skline@email.com','5558654345',1.75), 
    ('Armando','North','745 Winding Way, Corvallis, OR 97330','anorth@email.com','5552353493',0), 
    ('Chelsea','Lin','97 York Street, Corvallis, OR 97333','clin@email.com','5552342434',0);

  INSERT INTO Orders (order_id, member_id, order_date, due_date) VALUES
    (1,2,'2025-10-01','2025-10-11'),
    (2,1,'2025-10-13','2025-10-23'),
    (3,2,'2025-10-15','2025-10-25'),
    (4,4,'2025-10-16','2025-10-26'),
    (5,5,'2025-10-17','2025-10-27');

  INSERT INTO BookAuthors (book_id, author_id) VALUES
    (1,1),(2,1),(3,3),(4,4),(5,5),(6,6),(7,6),(7,7),(8,3);

  INSERT INTO BookOrders (book_order_id, order_id, book_id, quantity) VALUES
    (1,1,2,1),(2,1,4,1),(3,2,1,3),(4,3,6,1),(5,3,7,2),(6,3,8,1),(7,4,2,1),(8,5,2,1);

  INSERT INTO BookGenres (book_genre_id, book_id, genre_id) VALUES
    (1,1,1),(2,2,1),(3,3,2),(4,3,4),(5,4,2),(6,4,4),(7,5,5),(8,6,3),(9,7,2),(10,8,3);
END