import { useState } from 'react';
import './AddTaskForm.css';

function AddTaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddTask(title.trim());
      setTitle('');
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <div className="form-group">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="task-input"
          disabled={isSubmitting}
          maxLength={100}
        />
        <button 
          type="submit" 
          className="add-btn"
          disabled={!title.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <span className="loading-spinner"></span>
          ) : (
            '+ Add Task'
          )}
        </button>
      </div>
    </form>
  );
}

export default AddTaskForm;
