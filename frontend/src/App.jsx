import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Auth from './components/Auth';
import Analytics from './components/Analytics';
import { getTasks, createTask, updateTask, deleteTask, fetchUserStats } from './services/api'; // userStats
import { PlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import Confetti from 'react-confetti';

const App = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load user from local storage
  useEffect(() => {
    const savedUser = localStorage.getItem('taskAppUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch tasks AND user stats (for XP)
  const loadData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [fetchedTasks, fetchedUser] = await Promise.all([
        getTasks(user.id),
        fetchUserStats(user.id)
      ]);
      setTasks(fetchedTasks);
      // Update user state with new XP/Level from backend
      const updatedUser = { ...user, ...fetchedUser };
      setUser(updatedUser);
      localStorage.setItem('taskAppUser', JSON.stringify(updatedUser));
      setError(null);
    } catch (err) {
      setError('Failed to load data.');
      if (err.message && err.message.includes('Unauthorized')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setTasks([]);
    }
  }, [user?.id]); // Only re-run if user ID changes (or login)

  // Auth Handlers
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('taskAppUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('taskAppUser');
    setTasks([]);
  };

  // Task Handlers
  const handleCreateOrUpdate = async (taskData) => {
    if (!user) return;
    try {
      if (editingTask) {
        const updated = await updateTask(editingTask.id, taskData, user.id);
        const newTasks = tasks.map(t => t.id === updated.id ? updated : t);
        setTasks(newTasks);

        // If completing via edit modal (possible?) check XP? mostly done via toggle.
      } else {
        const created = await createTask(taskData, user.id);
        setTasks([created, ...tasks]); // Add to top
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      alert('Failed to save task');
    }
  };

  const handleDelete = async (id) => {
    if (!user) return;
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(id, user.id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const handleToggleComplete = async (task) => {
    if (!user) return;
    try {
      const updated = await updateTask(task.id, { ...task, completed: !task.completed }, user.id);

      // If task was JUST completed
      if (updated.completed && !task.completed) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000); // 5s celebration
        // Refresh User Stats to get new XP
        const stats = await fetchUserStats(user.id);
        setUser({ ...user, xp: stats.xp, level: stats.level });
      }

      setTasks(tasks.map(t => t.id === updated.id ? updated : t));
    } catch (err) {
      alert('Failed to update task status');
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Filtering
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    if (filter === 'category') return true;
    return true;
  });

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Layout currentFilter={filter} setFilter={setFilter} user={user}>
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} numberOfPieces={200} recycle={false} />}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-500 mt-1">
            Manage your tasks and level up!
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 px-4 py-3 text-gray-600 bg-white/50 border border-gray-200/50 font-medium rounded-xl hover:bg-white transition-all shadow-sm backdrop-blur-sm"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-lg transform hover:-translate-y-0.5"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Analytics Widget */}
      <Analytics tasks={tasks} />

      <h3 className="font-bold text-xl text-gray-700 mb-4">Your Tasks</h3>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100">
          {error}
        </div>
      )}

      {loading && tasks.length === 0 ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <TaskList
          tasks={filteredTasks}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onToggleComplete={handleToggleComplete}
        />
      )}

      <TaskForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        result={editingTask}
        title={editingTask ? 'Edit Task' : 'New Task'}
      />
    </Layout>
  );
};

export default App;
