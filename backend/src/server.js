const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fitnessdb';

app.use(cors());
app.use(express.json());

// ── Workout Schema ───────────────────────────────────────────────────────────
const workoutSchema = new mongoose.Schema({
  userId:    { type: String, required: true },
  type:      { type: String, required: true },   // e.g. "running", "cycling"
  duration:  { type: Number, required: true },   // minutes
  calories:  { type: Number },
  date:      { type: Date, default: Date.now },
  notes:     { type: String },
});
const Workout = mongoose.model('Workout', workoutSchema);

// ── Routes ───────────────────────────────────────────────────────────────────
app.get('/health', (req, res) =>
  res.json({ status: 'healthy', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' })
);

app.get('/api/workouts/:userId', async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/workouts', async (req, res) => {
  try {
    const workout = new Workout(req.body);
    await workout.save();
    res.status(201).json(workout);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/workouts/:id', async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.json({ message: 'Workout deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DB Connect & Start ───────────────────────────────────────────────────────
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;
