const express = require('express');
const path = require('path');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8081;

// Middleware to allow cross-domain requests
const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

// Support parsing of application/json type post data
app.use(bodyParser.json());

// Support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// Use CORS and custom cross-domain middleware
app.use(cors());
app.use(allowCrossDomain);

// Serve static files
app.use(express.static(path.join(__dirname, '/dist/WebDBSchiffsverleih-1/browser'))); // TODO: rename to your app-name

// Start the server
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});

// Serve the main application
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, '/dist/WebDBSchiffsverleih-1/browser') }); // TODO: rename to your app-name
});

// MySQL connection configuration
const dbConfig = {
    database: "schiff_verleih",
    host: "127.0.0.1",
    port: "3306",
    user: "root",
    password: "Esemmutlu", // Replace with your MySQL root password
};

const con = mysql.createConnection(dbConfig);

// Connect to the database
con.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + con.threadId);
});

// Handle /benutzer endpoint
app.get('/benutzer', (req, res) => {
    con.query("SELECT * FROM benutzer", (error, results, fields) => {
        if (error) {
            console.error('Error fetching benutzer:', error);
            res.status(500).send('Error occurred while fetching data');
            return;
        }
        res.json(results);
    });
});

// Gracefully handle shutdown
process.on('SIGINT', () => {
    con.end(err => {
        if (err) {
            console.error('Error disconnecting from MySQL:', err);
        } else {
            console.log('Disconnected from MySQL');
        }
        process.exit(0);
    });
});
