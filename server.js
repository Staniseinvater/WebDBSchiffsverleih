const express = require('express');
const path = require('path');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 8081;
const JWT_SECRET = 'jwtSecret'; // Ersetzen Sie durch Ihren eigenen geheimen Schlüssel

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

// Handle /benutzer/login endpoint
app.post('/benutzer/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    const query = 'SELECT * FROM benutzer WHERE benutzername = ? AND passwort = ? LIMIT 1';
    con.query(query, [username, password], (err, results) => {
        console.log(results);
        if (err) {
            console.error('Error fetching benutzer:', err);
            return res.status(500).send('Server error');
        }

        if (results.length === 0) {
            return res.status(401).send('Invalid username or password');
        }

        const user = results[0];
        if (!user) {
            return res.status(400).send('Invalid username or password');
        }

        const current_time = Math.floor(Date.now() / 1000);
        const expiration_time = current_time + 864000; // ten days
        const claims = {
            'sub': 'public_key',
            'exp': expiration_time,
            'id': user.id,
        };

        const token = jwt.sign(claims, JWT_SECRET, { algorithm: 'HS256' });
        res.send({ token });
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
