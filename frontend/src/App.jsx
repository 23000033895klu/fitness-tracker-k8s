import { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const USER_ID = 'demo-user';

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({ type: 'running', duration: '', calories: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchWorkouts(); }, []);

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/workouts/${USER_ID}`);
      const data = await res.json();
      setWorkouts(data);
    } catch {
      setError('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  const addWorkout = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/api/workouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, userId: USER_ID }),
      });
      setForm({ type: 'running', duration: '', calories: '', notes: '' });
      fetchWorkouts();
    } catch {
      setError('Failed to save workout');
    }
  };

  const deleteWorkout = async (id) => {
    await fetch(`${API_URL}/api/workouts/${id}`, { method: 'DELETE' });
    fetchWorkouts();
  };

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'sans-serif', padding: '0 16px' }}>
      <h1>🏋️ Fitness Tracker</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={addWorkout} style={{ background: '#f5f5f5', padding: 20, borderRadius: 8, marginBottom: 24 }}>
        <h2>Log Workout</h2>
        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ marginRight: 8 }}>
          {['running', 'cycling', 'swimming', 'strength', 'yoga'].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input placeholder="Duration (min)" type="number" value={form.duration} required
          onChange={e => setForm({ ...form, duration: e.target.value })} style={{ marginRight: 8, width: 120 }} />
        <input placeholder="Calories" type="number" value={form.calories}
          onChange={e => setForm({ ...form, calories: e.target.value })} style={{ marginRight: 8, width: 100 }} />
        <input placeholder="Notes" value={form.notes}
          onChange={e => setForm({ ...form, notes: e.target.value })} style={{ marginRight: 8, width: 160 }} />
        <button type="submit" style={{ background: '#007bff', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>
          Add
        </button>
      </form>

      <h2>Workout History</h2>
      {loading && <p>Loading...</p>}
      {workouts.map(w => (
        <div key={w._id} style={{ border: '1px solid #ddd', borderRadius: 6, padding: 12, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <strong>{w.type}</strong> — {w.duration} min
            {w.calories && ` · ${w.calories} kcal`}
            {w.notes && <em style={{ color: '#666' }}> · {w.notes}</em>}
            <div style={{ fontSize: 12, color: '#999' }}>{new Date(w.date).toLocaleDateString()}</div>
          </div>
          <button onClick={() => deleteWorkout(w._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545', fontSize: 16 }}>✕</button>
        </div>
      ))}
      {!loading && workouts.length === 0 && <p style={{ color: '#999' }}>No workouts logged yet.</p>}
    </div>
  );
}

export default App;
