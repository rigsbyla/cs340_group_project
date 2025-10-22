DROP TABLE IF EXISTS Members;
CREATE TABLE Members(
    member_id INT AUTO_INCREMENT NOT NULL, 
    first_name VARCHAR[45] NOT NULL,
    last_name VARCHAR[45] NOT NULL,
    address VARCHAR[145] NOT NULL,
    email VARCHAR[145], 
    phone_number char[10],
    fee_total FLOAT NOT NULL,
    PRIMARY KEY (member_id)
);


INSERT INTO Members (first_name, last_name, address, email, phone_number, fee_total)
VALUES 
    ("Bob", "Smith", "7962 Buckingham Drive, Corvallis, OR 97330", "bsmith@email.com", "5553425234", 0), 
    ("Harvey", "Simon", "29 Sherman Street, Corvallis, OR 97330", "hsimon@email.com", "5553483824", 3), 
    ("Sherry", "Kline", "410 Water Street, Suite 3, Corvallis, OR 97330", "skline@email.com", "5558654345", 1.75), 
    ("Armando", "North", "745 Winding Way, Corvallis, OR 97330", "anorth@email.com", "5552353493", 0), 
    ("Chelsea", "Lin", "97 York Street, Corvallis, OR 97333", "clin@email.com", "5552342434", 0);


DROP TABLE IF EXISTS Orders;
CREATE TABLE Orders(
    order_id INT AUTO_INCREMENT NOT NULL, 
    member_id NOT NULL, 
    order_date DATE NOT NULL, 
    due_date DATE NOT NULL, 
    FOREIGN KEY (member_id) REFERENCES Members(member_id),
    PRIMARY KEY (order_id)
);

INSERT INTO Orders (order_id, member_id, order_date, due_date)
VALUES
    (2, "2025-10-01", "2025-10-11"), 
    (1, "2025-10-13", "2025-10-23"), 
    (2, "2025-20-15", "2025-10-25"), 
    (2, "2025-20-16", "2025-10-26"), 
    (2, "2025-20-17", "2025-10-27");


DROP TABLE IF EXISTS BookAuthors;
CREATE TABLE BookAuthors(
    book_author_id INT AUTO_INCREMENT NOT NULL, 
    book_id NOT NULL, 
    author_id NOT NULL, 
    FOREIGN KEY (book_id) REFERENCES Books(book_id), 
    FOREIGN KEY (author_id) REFERENCES Authors(author_id), 
    PRIMARY KEY (book_author_id)
);

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

