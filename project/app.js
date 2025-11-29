// ########################################
// ########## SETUP

// Express
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const PORT = 3999;

// Database
const db = require('./database/db-connector');

// Handlebars
const { engine } = require('express-handlebars'); // Import express-handlebars engine
app.engine('.hbs', engine({ extname: '.hbs' })); // Create instance of handlebars
app.set('view engine', '.hbs'); // Use handlebars engine for *.hbs files.

// ########################################
// ########## ROUTE HANDLERS
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// READ ROUTES
app.get('/', async function (req, res) {
    try {
        res.render('home'); // Render the home.hbs file
    } catch (error) {
        console.error('Error rendering page:', error);
        // Send a generic error message to the browser
        res.status(500).send('An error occurred while rendering the page.');
    }
});


app.get('/books', async function (req, res) {
    try {
        // Create and execute our queries
          const query1 = `
        SELECT Books.book_id, 
        Books.title, 
        Books.call_num, 
        Books.quantity, 
        GROUP_CONCAT(DISTINCT Authors.author_name SEPARATOR ', ') as author,
        GROUP_CONCAT(DISTINCT Genres.genre_name SEPARATOR ', ') as genre
        FROM Books
        INNER JOIN BookAuthors ON BookAuthors.book_id = Books.book_id
        INNER JOIN Authors ON Authors.author_id = BookAuthors.author_id
        INNER JOIN BookGenres ON BookGenres.book_id = Books.book_id
        INNER JOIN Genres ON Genres.genre_id = BookGenres.genre_id
        GROUP BY Books.book_id, Books.title, Books.call_num, Books.quantity
        ;`;
        const [books] = await db.query(query1);
        
        res.render('books', {books: books}); // Render the home.hbs file
    } catch (error) {
        console.error('Error rendering page:', error);
        // Send a generic error message to the browser
        res.status(500).send('An error occurred while rendering the page.');
    }
});

app.post('/books-delete', async function (req, res) {
    try {
        const {delete_book_id} = req.body;
        const [rows] = await db.query(
            'CALL delete_book(?)',
            [delete_book_id]           
        );
        res.redirect('/books');
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).send('An error occurred while deleting the book.');
    }
});

// add a new book using stored procedure
app.post('/books-new', async function (req, res) {
    try {
        const { book_title, book_call_num, book_quantity, author_names, genre_names } = req.body;

        await db.execute(
            `CALL add_book_with_author_genre(?, ?, ?, ?, ?)`,
            [
                book_title,
                book_call_num,
                book_quantity,
                author_names,
                genre_names
            ]
    );
        res.redirect('/books');

    } catch (error) {
        console.error('Error inserting book:', error);
        res.status(500).send('An error occurred while inserting the book.');
    }
});


app.get('/members', async function (req, res) {
    try {
        // Create and execute our queries
        const query1 = `SELECT * FROM Members;`;
        const [people] = await db.query(query1);

        res.render('members', { people: people });
    } catch (error) {
        console.error('Error executing queries:', error);
        
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/members-delete', async function (req, res) {
    try {
        const {delete_member_id} = req.body;
        const [rows] = await db.query(
            'CALL delete_member(?)',
            [delete_member_id]           
        );
        res.redirect('/members');
    } catch (error) {
        console.error('Error deleting member:', error);
        res.status(500).send('An error occurred while deleting the member.');
    }
});

app.get('/members-new', async function (req, res) {
    try {
        // Create and execute our queries
        const query1 = `SELECT * FROM Members;`;
        const [people] = await db.query(query1);

        res.render('members-new', { people: people });
    } catch (error) {
        console.error('Error executing queries:', error);
        
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.post('/members-new', async function (req, res) {
    try {
        const { create_person_first_name, create_person_last_name, create_person_address, create_person_email, create_person_phone_number } = req.body;

        await db.execute(
            `INSERT INTO Members (first_name, last_name, address, email, phone_number)
            VALUES (?, ?, ?, ?, ?)`,
            [
                create_person_first_name,
                create_person_last_name,
                create_person_address,
                create_person_email,
                create_person_phone_number
            ]
    );
        res.redirect('/members');

    } catch (error) {
        console.error('Error inserting member:', error);
        res.status(500).send('An error occurred while inserting the member.');
    }
});

        

app.get('/member-update', async function (req, res) {
    try {
        // Create and execute our queries
        const query1 = `SELECT * FROM Members;`;
        const [people] = await db.query(query1);

        res.render('member-update', { people: people });
    } catch (error) {
        console.error('Error executing queries:', error);
        
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});


app.get('/orders', async function (req, res) {
    try {
        // Create and execute our queries
        const query1 = `
        SELECT Orders.order_id, 
        Members.first_name AS member, 
        Members.last_name AS member_last_name, 
        Orders.order_date, 
        Orders.due_date FROM Orders

            INNER JOIN Members ON Orders.Member_id =  Members.member_id ;`;
        const [orders] = await db.query(query1);

        // Format Dates
        orders.forEach(o => {
            o.order_date = o.order_date.toISOString().split('T')[0];
            o.due_date = o.due_date.toISOString().split('T')[0];
        });

        res.render('orders', { orders: orders });
    } catch (error) {
        console.error('Error executing queries:', error);
        
        // Send a generic error message to the browser
        res.status(500).send(
            'An error occurred while executing the database queries.'
        );
    }
});

app.get('/orders-new', async function (req, res) {
    try {
        res.render('orders-new'); // Render the home.hbs file
    } catch (error) {
        console.error('Error rendering page:', error);
        // Send a generic error message to the browser
        res.status(500).send('An error occurred while rendering the page.');
    }
});

app.get('/order-details', async function (req, res) {
    try {
        const query1 = `
        SELECT BookOrders.book_order_id, 
        BookOrders.order_id, 
        Books.title AS book_title, 
        BookOrders.quantity, 
        CONCAT(Members.first_name , ' ', Members.last_name) AS member_name
        FROM BookOrders
        INNER JOIN Books ON BookOrders.book_id = Books.book_id
        INNER JOIN Orders ON BookOrders.order_id = Orders.order_id
        LEFT JOIN Members ON Members.member_id = Orders.member_id;`;
        const [orderdetail] = await db.query(query1);
        res.render('order-details', { orderdetail: orderdetail }); // Render the home.hbs file
    } catch (error) {
        console.error('Error rendering page:', error);
        // Send a generic error message to the browser
        res.status(500).send('An error occurred while rendering the page.');
    }
});

app.get('/bookorders-new', async function (req, res) {
    try {
        const query1 = 'SELECT member_id, first_name, last_name FROM Members;';
        const [members] = await db.query(query1);

        const query2 = 'SELECT book_id, title, quantity FROM Books;';
        const [books] = await db.query(query2);
        
        res.render('bookorders-new', { members: members, books: books}); // Render the home.hbs file
    }
    catch (error) {
        console.error('Error rendering page:', error);
        // Send a generic error message to the browser
        res.status(500).send('An error occurred while rendering the page.');
    }
});
app.post('/bookorders-new', async function (req, res) {
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const { member_id, order_date, due_date, book_id, quantity } = req.body;
        
        // Insert into Orders table
        const orderQuery = 'INSERT INTO Orders (member_id, order_date, due_date) VALUES (?, ?, ?)';
        const [orderResult] = await connection.query(orderQuery, [member_id, order_date, due_date]);
        const orderId = orderResult.insertId;
        
        // Insert each book into BookOrders table
        const bookIds = Array.isArray(book_id) ? book_id : [book_id];
        const quantities = Array.isArray(quantity) ? quantity : [quantity];
        
        for (let i = 0; i < bookIds.length; i++) {
            const bookOrderQuery = 'INSERT INTO BookOrders (order_id, book_id, quantity) VALUES (?, ?, ?)';
            await connection.query(bookOrderQuery, [orderId, bookIds[i], quantities[i]]);
        }
        
        await connection.commit();
        res.status(201).json({ message: 'Order created successfully', order_id: orderId });
        
    } catch (error) {
        await connection.rollback();
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'An error occurred while creating the order.' });
    } finally {
        connection.release();
    }
});

app.post('/book-order-delete', async function (req, res) {
    try {
        const {delete_book_order_id} = req.body;
        const [rows] = await db.query(
            'CALL delete_book_order(?)',
            [delete_book_order_id]           
        );
        res.redirect('/order-details');
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).send('An error occurred while deleting the book.');
    }
});
// UPDATE book quantity
app.post('/books-update-quantity', async function (req, res) {
    try {
        const { book_id, quantity } = req.body;
        const query = 'UPDATE Books SET quantity = ? WHERE book_id = ?';
        await db.query(query, [quantity, book_id]);
        res.status(200).json({ message: 'Quantity updated successfully' });
    } catch (error) {
        console.error('Error updating book quantity:', error);
        res.status(500).json({ error: 'An error occurred while updating the book quantity.' });
    }
});


// Reset database for testing
app.post('/api/reset-db', async (req, res) => {
  try {
    

    await db.query('CALL load_librarydb();');
    console.log('✅ Database reset successfully');
    res.json({ ok: true });
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    res.status(500).json({ ok: false, error: 'Error resetting database.' });
  }
});


// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log(
        'Express started on http://localhost:' +
            PORT +
            '; press Ctrl-C to terminate.'
    );
});
