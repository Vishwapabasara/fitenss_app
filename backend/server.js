// db-test.js
const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Fitness'
});

db.connect((err) => {
    if (err) return console.error('❌ DB Error:', err);
    console.log('✅ Connected to DB');

    // Run your query
    db.query('SELECT * FROM Customer_details', (err, results) => {
        if (err) return console.error(err);
        console.log(results);
        db.end(); // close connection
    });
});
