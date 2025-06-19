import './TaskItem.css';

function TaskItem({ task, onToggle, onDelete }) {
  const handleToggle = () => {
    onToggle(task.id);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggle}
            className="task-checkbox"
          />
          <span className="checkmark"></span>
        </label>
        
        <span className={`task-title ${task.completed ? 'strikethrough' : ''}`}>
          {task.title}
        </span>
      </div>
      
      <button 
        onClick={handleDelete}
        className="delete-btn"
        title="Delete task"
        aria-label="Delete task"
      >
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <polyline points="3,6 5,6 21,6"></polyline>
          <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    </div>
  );
}

export default TaskItem;
