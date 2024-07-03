const express = require('express');
const path = require('path');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');
const saltRounds = 10;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

const PORT = 8081;
const JWT_SECRET = 'jwtSecret';

const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
};

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


app.use(cors());
app.use(allowCrossDomain);


app.use(express.static(path.join(__dirname, '/dist/WebDBSchiffsverleih-1/browser')));

// Start the server
server.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

// Serve the main application
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, '/dist/WebDBSchiffsverleih-1/browser') });
});

// MySQL connection
const dbConfig = {
  database: "schiff_verleih",
  host: "127.0.0.1",
  port: "3306",
  user: "root",
  password: "Esemmutlu",
};

const con = mysql.createConnection(dbConfig);

// Connection to the database
con.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + con.threadId);
});

// JWT token
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// WebSocket connection
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const notifyTicketUpdate = () => {
  io.emit('ticketUpdate', { message: 'Ticket status updated' });
};

// Handle /benutzer endpoint
app.get('/benutzer', authenticateJWT, (req, res) => {
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
  const schiffeQuery = "SELECT schiff.*, hafen.name as hafenName FROM schiff JOIN hafen ON schiff.hafenId = hafen.id";
  const bilderQuery = "SELECT * FROM schiffbild";

  con.query(schiffeQuery, (error, schiffeResults) => {
    if (error) {
      console.error('Error fetching schiffe:', error);
      return res.status(500).send('Error occurred while fetching data');
    }

    con.query(bilderQuery, (error, bilderResults) => {
      if (error) {
        console.error('Error fetching bilder:', error);
        return res.status(500).send('Error occurred while fetching data');
      }

      const schiffeWithBilder = schiffeResults.map(schiff => {
        schiff.bildUrls = bilderResults.filter(bild => bild.schiffId === schiff.id).map(bild => bild.bildUrl);
        return schiff;
      });

      res.json(schiffeWithBilder);
    });
  });
});

app.put('/schiffe/:id/hafen', authenticateJWT, (req, res) => {
  const schiffId = req.params.id;
  const zielHafenId = req.body.zielHafenId;

  const query = 'UPDATE schiff SET hafenId = ? WHERE id = ?';
  con.query(query, [zielHafenId, schiffId], (err, results) => {
    if (err) {
      console.error('Error updating hafenId:', err);
      return res.status(500).send('Error occurred while updating hafenId');
    }

    // Get the updated schiff data
    const selectQuery = 'SELECT schiff.*, hafen.name as hafenName FROM schiff JOIN hafen ON schiff.hafenId = hafen.id WHERE schiff.id = ?';
    con.query(selectQuery, [schiffId], (err, schiffResults) => {
      if (err) {
        console.error('Error fetching updated schiff:', err);
        return res.status(500).send('Error occurred while fetching updated schiff');
      }
      res.send(schiffResults[0]);

      notifyTicketUpdate();
    });
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
        const expiration_time = current_time + 86400;
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

        return res.status(201).json({ message: 'User created successfully' });
      });
    });
  });
});

// Handle /haefen endpoint to fetch haefen
app.get('/haefen', (req, res) => {
  const query = 'SELECT * FROM hafen';
  con.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching haefen:', error);
      return res.status(500).send('Error occurred while fetching haefen');
    }
    res.json(results);
  });
});

// Handle /ausleihen endpoint to create a new booking
app.post('/ausleihen', authenticateJWT, (req, res) => {
  const { schiffId, name, email, startDate, endDate, zielHafen } = req.body;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  const updateHafenQuery = 'UPDATE schiff SET hafenId = ? WHERE id = ?';
  con.query(updateHafenQuery, [zielHafen, schiffId], (updateErr, updateResults) => {
    if (updateErr) {
      console.error('Error updating hafenId:', updateErr);
      return res.status(500).send('Error occurred while updating hafenId');
    }

    const insertQuery = 'INSERT INTO ausleihen (schiffId, name, email, startDate, endDate, zielHafen) VALUES (?, ?, ?, ?, ?, ?)';
    con.query(insertQuery, [schiffId, name, email, formattedStartDate, formattedEndDate, zielHafen], (insertErr, insertResults) => {
      if (insertErr) {
        console.error('Error inserting ausleihen:', insertErr);
        return res.status(500).send('Error occurred while inserting ausleihen');
      }

      res.status(201).json({ message: 'Booking created successfully and hafenId updated' });

      notifyTicketUpdate();
    });
  });
});

// Handle /comments endpoint
app.get('/comments', (req, res) => {
  const query = 'SELECT * FROM comments ORDER BY created_at DESC';
  con.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching comments:', error);
      return res.status(500).send('Error occurred while fetching comments');
    }
    res.json(results);
  });
});

app.post('/comments', authenticateJWT, (req, res) => {
  const { author, location, text } = req.body;
  const query = 'INSERT INTO comments (author, location, text) VALUES (?, ?, ?)';
  con.query(query, [author, location, text], (error, results) => {
    if (error) {
      console.error('Error adding comment:', error);
      return res.status(500).send({ error: 'Error occurred while adding comment' });
    }
    res.status(201).send({ message: 'Comment added successfully' });

    io.emit('newComment', { author, location, text });
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

function isAuthenticated(req) {
  return req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer';
}
app.get('/schiffe/:id/gebuchte-daten', authenticateJWT, (req, res) => {
  const schiffId = req.params.id;
  const query = 'SELECT startDate, endDate FROM ausleihen WHERE schiffId = ?';

  con.query(query, [schiffId], (error, results) => {
    if (error) {
      console.error('Error fetching gebuchte daten:', error);
      return res.status(500).send('Error occurred while fetching gebuchte daten');
    }
    res.json(results);
  });
});

app.get('/haefen', (req, res) => {
  const query = 'SELECT * FROM hafen';
  con.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching haefen:', error);
      return res.status(500).send('Error occurred while fetching haefen');
    }
    res.json(results);
  });
});
