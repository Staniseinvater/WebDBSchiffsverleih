// set up ======================== 
var express = require('express');
var app = express();                               // create our app w/ express 
var path = require('path');
var mysql = require('mysql');
var cors = require('cors');
const allowCrossDomain = (req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Typ');
      next();
};

bodyParser = require('body-parser');


// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(allowCrossDomain);

// configuration =================
app.use(express.static(path.join(__dirname, '/dist/WebDBSchiffsverleih-1/browser')));  //TODO rename to your app-name

// listen (start app with node server.js) ======================================
app.listen(8081, function () {
      console.log("App listening on port 8081");
});

// application -------------------------------------------------------------
app.get('/', function (req, res) {
      //res.send("Hello World123");     
      res.sendFile('index.html', { root: __dirname + '/dist/ebDBSchiffsverleih-1/browser' });    //TODO rename to your app-name
});

var con = mysql.createConnection({
      database: "schiff_verleih",
      host: "localhost",
      port: "3306",
      user: "root",
      password: "Sam3213314",
});

// Connect to the database
con.connect(function (err) {
      if (err) {
            console.error('error connecting: ' + err.stack);
            return;
      }
      console.log('connected as id ' + con.threadId);
});

// Handle /benutzer endpoint
app.get('/benutzer', function (req, res) {
      con.query("SELECT * FROM benutzer", function (error, results, fields) {
            if (error) {
                  console.error(error);
                  res.status(500).send('Error occurred while fetching data');
                  return;
            }
            res.send(results);
      });
});

// Gracefully handle shutdown
process.on('SIGINT', () => {
      con.end(function (err) {
            if (err) {
                  console.error(err);
            }
            console.log('Disconnected from database');
            process.exit(0);
      });
});