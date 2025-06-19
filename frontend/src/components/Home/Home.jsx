import { useState, useEffect } from 'react';
import './Home.css';
import AddTaskForm from '../AddTaskForm';
import TaskItem from '../TaskItem';

const API_BASE_URL = 'http://localhost:8000';

function Home() {
  const [tasks, setTasks] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks. Make sure the backend server is running.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (title) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, completed: false }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTask = await response.json();
      setTasks([...tasks, newTask]);
    } catch (err) {
      setError('Failed to add task');
      console.error('Error adding task:', err);
    }
  };

  const toggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  const filteredTasks = showCompleted
    ? tasks.filter(task => task.completed)
    : tasks;

  return (
    <div className="home-container">
      <header className="header">
        <h1>Task Tracker</h1>
        <p>Stay organized and get things done!</p>
      </header>

      <main className="main-content">
        <AddTaskForm onAddTask={addTask} />

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="task-controls">
          <button
            className={`filter-btn ${!showCompleted ? 'active' : ''}`}
            onClick={() => setShowCompleted(false)}
          >
            Show All Tasks ({tasks.length})
          </button>
          <button
            className={`filter-btn ${showCompleted ? 'active' : ''}`}
            onClick={() => setShowCompleted(true)}
          >
            Show Completed ({tasks.filter(t => t.completed).length})
          </button>
        </div>

        <div className="task-list">
          {loading ? (
            <div className="loading">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">
              {showCompleted
                ? "No completed tasks yet!"
                : "No tasks yet! Add one above to get started."}
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;
