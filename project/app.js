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
        const query1 = 'SELECT * FROM Books;';
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
        INNER JOIN Orders ON BookOrders.order_id = Orders.member_id
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


// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log(
        'Express started on http://localhost:' +
            PORT +
            '; press Ctrl-C to terminate.'
    );
});
