import sqlite3
import os

DATABASE_NAME = "tasks.db"


def init_database():
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            completed BOOLEAN DEFAULT FALSE
        )
    """
    )

    conn.commit()
    conn.close()


def get_all_tasks():
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM tasks")
    tasks = cursor.fetchall()
    conn.close()

    return [
        {"id": task[0], "title": task[1], "completed": bool(task[2])} for task in tasks
    ]


def create_task(title: str, completed: bool = False):
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO tasks (title, completed) VALUES (?, ?)", (title, completed)
    )
    task_id = cursor.lastrowid

    conn.commit()
    conn.close()

    return {"id": task_id, "title": title, "completed": completed}


def update_task(task_id: int, title: str = None, completed: bool = None):
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    task = cursor.fetchone()

    if not task:
        conn.close()
        return None

    if title is not None:
        cursor.execute("UPDATE tasks SET title = ? WHERE id = ?", (title, task_id))
    if completed is not None:
        cursor.execute(
            "UPDATE tasks SET completed = ? WHERE id = ?", (completed, task_id)
        )

    conn.commit()

    cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    updated_task = cursor.fetchone()

    conn.close()

    return {
        "id": updated_task[0],
        "title": updated_task[1],
        "completed": bool(updated_task[2]),
    }


def delete_task(task_id: int):
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    task = cursor.fetchone()

    if not task:
        conn.close()
        return False

    cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()
    conn.close()

    return True
