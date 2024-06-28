const express = require('express');
const path = require('path');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
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



// Handle /schiffe endpoint
app.get('/schiffe', (req, res) => {
    con.query("SELECT * FROM schiffe", (error, results, fields) => {
        if (error) {
            console.error('Error fetching schiffe:', error);
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
    const query = 'SELECT * FROM benutzer WHERE benutzername = ? LIMIT 1';
    con.query(query, [username], (err, results) => {
        console.log(results);
        // Compare a password with its hash

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

        bcrypt.compare(password, user.passwort, (err, result) => {
            if (err) throw err;
            if (result) {
                const current_time = Math.floor(Date.now() / 1000);
                const expiration_time = current_time + 864000;
                const claims = {
                    'sub': 'public_key',
                    'exp': expiration_time,
                    'id': user.id,
                };

                const token = jwt.sign(claims, JWT_SECRET, { algorithm: 'HS256' });
                return res.send({ token });
            } else {
                return res.status(401).send('Nicht autorisiert');
            }
        });
    });

});

// Handle /benutzer/register endpoint
app.post('/benutzer/register', (req, res) => {
    const { name, surname, username, password, confirmPassword } = req.body;

    if (!username || !password || !name || !surname || !confirmPassword) {
        return res.status(400).send('All fields are required');
    }

    const userExistsQuery = 'SELECT * FROM benutzer WHERE benutzername = ?';
    con.query(userExistsQuery, [username], (err, results) => {
        if (err) {
            console.error('Error checking for existing user:', err);
            return res.status(500).send('Server error');
        }
        if (results.length > 0) {
            return res.status(409).send('User already exists');
        }


        if (password !== confirmPassword) {
            return res.status(400).send('Passwords do not match');
        }

        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).send('Server error');
            }

            const query = 'INSERT INTO benutzer (vorname, benutzername, passwort, nachname) VALUES (?, ?, ?, ?)';
            con.query(query, [name, username, hash, surname], (err, results) => {
                if (err) {
                    console.error('Error creating benutzer:', err);
                    return res.status(500).send('Server error');
                }

                return res.status(201).json({message: 'User created successfully'});
            });
        });
    });
});


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
