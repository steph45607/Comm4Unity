from fastapi import FastAPI, HTTPException, Depends, Path
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from pydantic import BaseModel
from passlib.context import CryptContext
import uuid

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="comm4unity_student"
)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Student(BaseModel):
    name: str
    email: str
    password: str
    batch: int

# Create an instance of CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/student/sign-up")
def student_signup(stud: Student):
    try:
        cursor = conn.cursor(dictionary=True)
        check_query = "SELECT * FROM students WHERE email = %s"
        cursor.execute(check_query, (stud.email,))
        existing_user = cursor.fetchone()

        if existing_user:
            raise HTTPException(status_code=400, detail="User with this email already exists")

        hashed_password = pwd_context.hash(stud.password)
        uid = str(uuid.uuid4())

        insert_query = "INSERT INTO students (s_id, name, email, password, batch) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(insert_query, (uid, stud.name, stud.email, hashed_password, stud.batch))
        conn.commit()

        return {"message": "User created successfully", "uid": uid}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()

@app.get("/student/{s_id}")
def read_student(s_id: str = Path(..., title="The UID of the student")):
    try:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM students WHERE s_id = %s"
        cursor.execute(query, (s_id,))
        user = cursor.fetchone()

        if user is None:
            raise HTTPException(status_code=404, detail="Student not found")

        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()

# @app.get("/student/get_all")
# def read_database():
#     try:
#         cursor = conn.cursor(dictionary=True)
#         query = "SELECT * FROM students"
#         cursor.execute(query)
#         result = cursor.fetchall()

#         return result
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
#     finally:
#         cursor.close()

@app.post("/student/log-in")
def student_login(stud: Student):
    try:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM students WHERE email = %s"
        cursor.execute(query, (stud.email,))
        user = cursor.fetchone()

        if user is None or not pwd_context.verify(stud.password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        return {"message": "Login successful", "s_id": user["s_id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
