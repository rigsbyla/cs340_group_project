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
        const query1 = 'SELECT * FROM books;';
        const [books] = await db.query(query1);
        
        res.render('books', {books: books}); // Render the home.hbs file
    } catch (error) {
        console.error('Error rendering page:', error);
        // Send a generic error message to the browser
        res.status(500).send('An error occurred while rendering the page.');
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
        Orders.member_id AS member_id
        FROM BookOrders
        INNER JOIN Books ON BookOrders.book_id = Books.book_id
        INNER JOIN Orders ON BookOrders.order_id = Orders.member_id;`;
        const [orderdetail] = await db.query(query1);
        res.render('order-details', { orderdetail: orderdetail }); // Render the home.hbs file
    } catch (error) {
        console.error('Error rendering page:', error);
        // Send a generic error message to the browser
        res.status(500).send('An error occurred while rendering the page.');
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
