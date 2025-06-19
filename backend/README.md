# Task Manager Backend

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Documentation

- **GET /tasks** - Get all tasks
- **POST /tasks** - Create a new task
- **PUT /tasks/{task_id}** - Update a task
- **DELETE /tasks/{task_id}** - Delete a task

Interactive API documentation available at: `http://localhost:8000/docs`
