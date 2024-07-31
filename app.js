const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Create MySQL connection
const connection = mysql.createConnection({
    // host: 'localhost',
    // user: 'root',
    // password: '',
    // database: 'c237'
    host: 'db4free.net',
    user: 'username_created_for_db4free.net',
    password: 'password_created_for_fb4free/net'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Set up view engine
app.set('view engine', 'ejs');
// Enable static files
app.use(express.static('public'));
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

app.get('/', (req, res) => {
    const sql = 'SELECT * FROM notice';
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving notices');
        }
        res.render('index', { notice: results });
    });
});


// Notice
app.get('/notice', (req, res) => {
    const sql = 'SELECT * FROM notice';
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving notice');
        }
        res.render('notice_list', { notice: results });
    });
});

// Reviews
app.get('/review', (req, res) => {
    const sql = 'SELECT * FROM reviews';
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving reviews');
        }
        res.render('review_list', { reviews: results });
    });
});

// Add review form
app.get('/addreview', (req, res) => {
    res.render('addreview');
});

// Handle add review form submission
app.post('/addreview', (req, res) => {
    const { name, description } = req.body;
    console.log(req.body); // Log the received form data
    const sql = 'INSERT INTO reviews (name, description) VALUES (?, ?)';
    connection.query(sql, [name, description], (error, results) => {
        if (error) {
            console.error('Database insert error:', error.message);
            return res.status(500).send('Error adding review');
        }
        res.redirect('/review');
    });
});

// Define routes for station (EWL)
app.get('/pasir_ris', (req, res) => {
    const sql = 'SELECT * FROM reviews'; // Assuming reviews for Pasir Ris are stored in the same table
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send('Error retrieving reviews');
        }
        res.render('pasir_ris', { reviews: results }); // Pass reviews data to pasir_ris.ejs
    });
});


// Define routes for each MRT line
app.get('/ewl', (req, res) => {
    res.render('ewl'); // Render the ewl.ejs view
});
app.get('/nsl', (req, res) => {
    res.render('nsl'); // Render the nsl.ejs view
});
app.get('/nel', (req, res) => {
    res.render('nel'); // Render the nel.ejs view
});
app.get('/ccl', (req, res) => {
    res.render('ccl'); // Render the ccl.ejs view
});
app.get('/dtl', (req, res) => {
    res.render('dtl'); // Render the dtl.ejs view
});
app.get('/tel', (req, res) => {
    res.render('tel'); // Render the tel.ejs view
});

// Define routes for station (EWL)
app.get('/pasir_ris', (req, res) => {
    res.render('pasir_ris'); // Render the pasir_ris.ejs view
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
