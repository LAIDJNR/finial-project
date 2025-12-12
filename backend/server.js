const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;
const MONGO_URI = 'mongodb+srv://demousers:babatunde123@cluster0.1vcukv5.mongodb.net/taskapp?retryWrites=true&w=majority&appName=Cluster0';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- MongoDB Connection ---
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- Mongoose Schemas ---
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now }
});

const TaskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    completed: { type: Boolean, default: false },
    dueDate: { type: String, default: '' },
    category: { type: String, default: 'General' },
    completedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Task = mongoose.model('Task', TaskSchema);

// --- Auth Routes ---

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        const newUser = new User({ username, password });
        await newUser.save();

        res.status(201).json({
            id: newUser._id,
            username: newUser.username,
            xp: newUser.xp,
            level: newUser.level
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error during registration' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({
            id: user._id,
            username: user.username,
            xp: user.xp,
            level: user.level
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error during login' });
    }
});

// --- User Stats Route ---
app.get('/users/me', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({
            id: user._id,
            username: user.username,
            xp: user.xp,
            level: user.level
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user stats' });
    }
});

// --- Task Routes (Protected) ---

const requireAuth = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    req.userId = userId;
    next();
};

app.get('/tasks', requireAuth, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
        const formattedTasks = tasks.map(t => ({
            id: t._id,
            ...t.toObject()
        }));
        res.json(formattedTasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

app.post('/tasks', requireAuth, async (req, res) => {
    try {
        const { title, description, dueDate, category } = req.body;
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const newTask = new Task({
            userId: req.userId,
            title,
            description,
            dueDate,
            category
        });

        await newTask.save();
        res.status(201).json({ id: newTask._id, ...newTask.toObject() });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
});

app.put('/tasks/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Exclude _id modification
        delete updates.id;
        delete updates._id;

        // Logic for XP: If completing a task that was not previously completed
        if (updates.completed === true) {
            const currentTask = await Task.findOne({ _id: id, userId: req.userId });
            if (currentTask && !currentTask.completed) {
                // Grant XP
                const user = await User.findById(req.userId);
                if (user) {
                    user.xp += 10;
                    // Simple level up formula: Level * 100 XP required
                    if (user.xp >= user.level * 100) {
                        user.level += 1;
                        user.xp = user.xp - ((user.level - 1) * 100); // Remaining XP or reset logic
                        // Actually simpler logic: Total XP determines level. 
                        // Level = Math.floor(XP / 100) + 1. But let's keep it additive for fun.
                        // Let's stick to: Every 100XP = 1 Level Up.
                    }
                    await user.save();
                    updates.completedAt = new Date();
                }
            }
        }

        const updatedTask = await Task.findOneAndUpdate(
            { _id: id, userId: req.userId },
            updates,
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ id: updatedTask._id, ...updatedTask.toObject() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

app.delete('/tasks/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Task.findOneAndDelete({ _id: id, userId: req.userId });

        if (!result) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
