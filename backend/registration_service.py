from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import mysql.connector
import requests
import uuid  # Import the uuid module

app = FastAPI()

class Registration(BaseModel):
    eventID: str
    # studID: str

# Placeholder for an in-memory database
registrations_db = []

# Connect to the local MySQL database
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="comm4unity_registration"
)

# @app.post("/registrations/")
# def create_registration(registration: Registration):
#     try:
#         # Check if the event exists
#         event_response = requests.get(f"http://localhost:8002/event/{registration.eventID}")
#         if event_response.status_code != 200:
#             raise HTTPException(status_code=404, detail="Event not found")

#         # Check if the student exists
#         student_response = requests.get(f"http://localhost:8000/student/{registration.studID}")
#         if student_response.status_code != 200:
#             raise HTTPException(status_code=404, detail="Student not found")

#         # Check if the student is already registered for the event
#         for existing_registration in registrations_db:
#             if (
#                 existing_registration["eventID"] == registration.eventID
#                 and existing_registration["studID"] == registration.studID
#             ):
#                 raise HTTPException(status_code=400, detail="Student is already registered for the event")

#         # Generate a UUID for registration_id
#         registration_id = str(uuid.uuid4())

#         # If all checks pass, add the registration to the in-memory database
#         registrations_db.append({"registration_id": registration_id, "eventID": registration.eventID, "studID": registration.studID})

#         # If needed, also store the registration in the MySQL database
#         cursor = conn.cursor()
#         cursor.execute("INSERT INTO registration (r_id, e_id, s_id) VALUES (%s, %s, %s)", (registration_id, registration.eventID, registration.studID))
#         conn.commit()

#         return {"message": "Registration created successfully", "registration_id": registration_id}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error creating registration: {str(e)}")
#     finally:
#         cursor.close()


@app.post("/registrations/{s_id}")
def create_registration(s_id: str, registration: Registration):
    cursor = None  # Initialize cursor outside the try block
    try:
        # Check if the event exists
        event_response = requests.get(f"http://localhost:8002/event/{registration.eventID}")
        if event_response.status_code != 200:
            raise HTTPException(status_code=404, detail="Event not found")

        # Check if the student exists
        student_response = requests.get(f"http://localhost:8000/student/{s_id}")
        if student_response.status_code != 200:
            raise HTTPException(status_code=404, detail="Student not found")

        # Check if the student is already registered for the event
        for existing_registration in registrations_db:
            if (
                existing_registration["eventID"] == registration.eventID
                and existing_registration["studID"] == s_id
            ):
                raise HTTPException(status_code=400, detail="Student is already registered for the event")

        # Generate a UUID for registration_id
        registration_id = str(uuid.uuid4())

        # If all checks pass, add the registration to the in-memory database
        registrations_db.append({"registration_id": registration_id, "eventID": registration.eventID, "studID": s_id})

        # If needed, also store the registration in the MySQL database
        cursor = conn.cursor()
        cursor.execute("INSERT INTO registration (r_id, e_id, s_id) VALUES (%s, %s, %s)", (registration_id, registration.eventID, s_id))
        conn.commit()
        return {"message": "Registration created successfully", "registration_id": registration_id}
    except HTTPException:
        # Propagate HTTP exceptions
        raise
    except Error as mysql_error:
        # Handle MySQL errors
        conn.rollback()  # Rollback the transaction in case of an error
        raise HTTPException(status_code=500, detail=f"Error creating registration: {mysql_error}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating registration: {str(e)}")
    finally:
        if cursor:
            cursor.close()