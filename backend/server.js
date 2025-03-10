const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost', // Corrected host
    user: 'root',  // Default XAMPP username
    password: '',   // Default XAMPP password is empty
    database: 'Fitness' // Ensure this database exists
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err);
    } else {
        console.log('✅ Connected to MySQL Database (Fitness)');
    }
});

// API to Fetch Customer Details
app.get('/customers', (req, res) => {
    db.query('SELECT * FROM Customer_details', (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            res.status(500).json({ error: 'Failed to retrieve customer details' });
        } else {
            res.json(results);
        }
    });
});

// API to Insert Customer Details
app.post('/customers', (req, res) => {
    const { name, age, height, weight, gender, bmi, bmiCategory, goal, bodyType, dietaryPreference, fitnessLevel, workoutsPerWeek, availableEquipment } = req.body;

    const query = `INSERT INTO Customer_details 
        (name, age, height, weight, gender, bmi, bmiCategory, goal, bodyType, dietaryPreference, fitnessLevel, workoutsPerWeek, availableEquipment) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [name, age, height, weight, gender, bmi, bmiCategory, goal, bodyType, dietaryPreference, fitnessLevel, workoutsPerWeek, JSON.stringify(availableEquipment)], (err, result) => {
        if (err) {
            console.error('Database insert error:', err);
            res.status(500).json({ error: 'Failed to insert customer details' });
        } else {
            res.json({ message: 'Customer details added successfully', id: result.insertId });
        }
    });
});

// Server Running on Port 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
