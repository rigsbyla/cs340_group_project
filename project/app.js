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

// ########################################
// ########## LISTENER

app.listen(PORT, function () {
    console.log(
        'Express started on http://localhost:' +
            PORT +
            '; press Ctrl-C to terminate.'
    );
});
