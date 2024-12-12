const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
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
    console.log("[GET] /api/tasks - Fetching all tasks");
    try {
        const tasks = await Task.find();
        console.log("[GET] /api/tasks - Success");
        res.status(200).json(tasks);
    } catch (error) {
        console.error("[GET] /api/tasks - Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Add a new task
app.post('/api/tasks', async (req, res) => {
    console.log("[POST] /api/tasks - Adding a new task");
    try {
        const { task_name } = req.body;
        if (!task_name) {
            console.warn("[POST] /api/tasks - Task name is required");
            return res.status(400).json({ message: 'Task name is required' });
        }

        const newTask = new Task({ task_name });
        await newTask.save();
        console.log("[POST] /api/tasks - Task added successfully");
        res.status(201).json(newTask);
    } catch (error) {
        console.error("[POST] /api/tasks - Error:", error.message);
        res.status(400).json({ error: error.message });
    }
});

// Edit a task
app.put('/api/tasks/:id', async (req, res) => {
    console.log(`[PUT] /api/tasks/${req.params.id} - Editing task`);
    try {
        const { id } = req.params;
        const { task_name } = req.body;

        if (!task_name) {
            console.warn(`[PUT] /api/tasks/${id} - Task name is required`);
            return res.status(400).json({ message: 'Task name is required' });
        }

        const updatedTask = await Task.findByIdAndUpdate(id, { task_name }, {
            new: true, // Return the updated document
            runValidators: true, // Validate before update
        });

        if (!updatedTask) {
            console.warn(`[PUT] /api/tasks/${id} - Task not found`);
            return res.status(404).json({ message: 'Task not found' });
        }

        console.log(`[PUT] /api/tasks/${id} - Task updated successfully`);
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error(`[PUT] /api/tasks/${req.params.id} - Error:`, error.message); // Fixed this line
        res.status(400).json({ error: error.message });
    }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
    console.log(`[DELETE] /api/tasks/${req.params.id} - Deleting task`);
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            console.warn(`[DELETE] /api/tasks/${id} - Task not found`);
            return res.status(404).json({ message: 'Task not found' });
        }

        console.log(`[DELETE] /api/tasks/${id} - Task deleted successfully`);
        res.status(204).send();
    } catch (error) {
        console.error(`[DELETE] /api/tasks/${req.params.id} - Error:`, error.message); // Fixed this line
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
