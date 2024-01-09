from fastapi import FastAPI, HTTPException, Depends, Path
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from pydantic import BaseModel
from passlib.context import CryptContext
import uuid

conn = mysql.connector.connect(
    host="35.199.165.211",
    port=3306,  # Replace with your actual MySQL port if it's different
    user="stephanie",
    password="staniswinata10",
    database="events",
    auth_plugin="mysql_native_password",
)


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/student/{s_id}")
def read_student(s_id: str):
    cursor = conn.cursor(dictionary=True)
    try:
        query = "SELECT * FROM Students WHERE id = %s"
        cursor.execute(query, (s_id,))
        user = cursor.fetchone()

        if user is None:
            raise HTTPException(status_code=404, detail="Student not found")

        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()

