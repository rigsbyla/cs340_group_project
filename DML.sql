-- Get all member information
SELECT * FROM Members;

-- Get all order information with member names
SELECT Orders.order_id, 
        Members.first_name AS member, 
        Members.last_name AS member_last_name, 
        Orders.order_date, 
        Orders.due_date FROM Orders

            INNER JOIN Members ON Orders.Member_id =  Members.member_id ;

-- Get all order details information with book titles
SELECT BookOrders.book_order_id, 
        BookOrders.order_id, 
        Books.title AS book_title, 
        BookOrders.quantity, 
        CONCAT(Members.first_name , ' ', Members.last_name) AS member_name
        FROM BookOrders
        INNER JOIN Books ON BookOrders.book_id = Books.book_id
        INNER JOIN Orders ON BookOrders.order_id = Orders.order_id
        LEFT JOIN Members ON Members.member_id = Orders.member_id;

-- Get all books
SELECT * FROM Books; 

--Get information about books for book orders
SELECT book_id, title, quantity FROM Books;

-- Insert new orders
INSERT INTO Orders (member_id, order_date, due_date) VALUES (?, ?, ?);

-- Insert new book orders
INSERT INTO BookOrders (order_id, book_id, quantity) VALUES (?, ?, ?);

-- Delete a member
DELETE FROM Members WHERE member_id = delete_member_id;

-- Delete an order
DELETE FROM BookOrders WHERE book_order_id = delete_book_order_id;

-- Delete a book
DELETE FROM Books WHERE book_id = delete_book_id;