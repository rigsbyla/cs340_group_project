-- Test Comment
CREATE TABLE Books( 
  book_id INT NOT NULL AUTO_INCREMENT UNIQUE,
  title VARCHAR(145) NOT NULL,
  call_num CHAR(6),
  quantity INT NOT NULL,
  PRIMARY KEY (book_id)
  ) ENGINE = InnoDB;
