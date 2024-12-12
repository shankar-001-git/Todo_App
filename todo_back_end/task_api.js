const express = require('express');
const mongoose = require('mongoose');
// const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
// // Enable Cross-Origin Resource Sharing app.use(cors()); 
app.use(express.json());

// MongoDB connection
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

// Define Task schema and model
const taskSchema = new mongoose.Schema({
    task_name: {
        type: String,
        required: true,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

const Task = mongoose.model('Task', taskSchema);

// Routes

// Get all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a new task
app.post('/api/tasks', async (req, res) => {
    try {
        const { task_name } = req.body;
        if (!task_name) {
            return res.status(400).json({ message: 'Task name is required' });
        }

        const newTask = new Task({ task_name });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Edit a task
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { task_name } = req.body;

        if (!task_name) {
            return res.status(400).json({ message: 'Task name is required' });
        }

        const updatedTask = await Task.findByIdAndUpdate(id, { task_name }, {
            new: true, // Return the updated document
            runValidators: true, // Validate before update
        });

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
