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
        Orders.member_id AS member_id
        FROM BookOrders
        INNER JOIN Books ON BookOrders.book_id = Books.book_id
        INNER JOIN Orders ON BookOrders.order_id = Orders.member_id;