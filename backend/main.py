from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import TaskCreate, TaskUpdate, TaskResponse
from database import init_database, get_all_tasks, create_task, update_task, delete_task
from typing import List

app = FastAPI(title="Task Manager API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://full-stack-task-manager-application.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    init_database()

@app.api_route("/", methods=["GET", "HEAD"])
async def root():
    return {"message": "Task Manager API is running!"}

@app.get("/tasks", response_model=List[TaskResponse])
async def get_tasks():
    tasks = get_all_tasks()
    return tasks

@app.post("/tasks", response_model=TaskResponse)
async def create_new_task(task: TaskCreate):
    new_task = create_task(task.title, task.completed)
    return new_task

@app.put("/tasks/{task_id}", response_model=TaskResponse)
async def update_existing_task(task_id: int, task_update: TaskUpdate):
    updated_task = update_task(task_id, task_update.title, task_update.completed)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task

@app.delete("/tasks/{task_id}")
async def delete_existing_task(task_id: int):
    success = delete_task(task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
