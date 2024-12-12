// Import required modules
const express = require('express');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB

const MONGO_URL = "mongodb://127.0.0.1:27017/node-ts-app";

mongoose
    .connect(MONGO_URL, { dbName: "node-ts-app" })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define Employee schema and model
const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

const Employee = mongoose.model('Employee', employeeSchema);

// API Endpoints

// Create a new employee
app.post('/employees', async (req, res) => {
    try {
        const employee = new Employee(req.body);
        await employee.save();
        res.status(201).json(employee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all employees
app.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single employee by ID
app.get('/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (employee) {
            res.status(200).json(employee);
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an employee by ID
app.put('/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true, // Validate before update
        });
        if (employee) {
            res.status(200).json(employee);
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete an employee by ID
app.delete('/employees/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (employee) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log("Server is running on http://localhost:${PORT}");
});