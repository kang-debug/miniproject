const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'MyNewPass',  
  database: 'miniUser'
});

db.connect(err => {
  if (err) {
      throw err;
  }
  console.log('MySQL Connected...');
});


app.post('/register', (req, res) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).send('Server error');
    }

    const user = { username, password: hash, coin: 0};

    db.query('INSERT INTO users SET ?', user, (err, result) => {
      if (err) {
        return res.status(500).send('Database error');
      }
      res.status(201).send('Sign Up Complete');
    });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      return res.status(500).send('Database error');
    }

    if (results.length === 0) {
      return res.status(401).send('Invalid username or password');
    }

    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err) {
        console.error('bcrypt compare error:', err);
        return res.status(500).send('Server error');
      }

      if (isMatch) {
        res.status(200).send({ 
          message: 'Login successful', 
          userData: {
            username: results[0].username,
            coin : results[0].coin
          }
        });
      } else {
        console.log('Password mismatch for user:', username);
        res.status(401).send('Invalid username or password');
      }
    });
  });
});
app.get('/user/:username', (req, res) => {
  const { username } = req.params;

  const query = `
      SELECT username, coin, 
             FIND_IN_SET(coin, (SELECT GROUP_CONCAT(coin ORDER BY coin DESC) FROM users)) AS rank 
      FROM users WHERE username = ?`;

  db.query(query, [username], (err, results) => {
      if (err) {
          console.error('Database query error:', err);
          return res.status(500).send('Database error');
      }
      if (results.length > 0) {
          res.status(200).send(results[0]);
      } else {
          res.status(404).send('User not found');
      }
  });
});

app.post('/update-coin', (req, res) => {
  const { username, coin } = req.body;

  db.query(
    'UPDATE users SET coin = ? WHERE username = ?', 
    [coin, username], 
    (err, result) => {
      if (err) {
        console.error('Database update error:', err);
        return res.status(500).send('Database error');
      }
      res.status(200).send('Coin value updated successfully');
    }
  );
});


app.get('/ranking', (req, res) => {

  db.query('SELECT username, coin FROM users ORDER BY coin DESC', (err, results) => {
    if (err) {
      return res.status(500).send('Database error');
    }

    res.status(200).send(results);
  });
});

app.listen(3001, () => {
  console.log('Server started on port 3001');
});
