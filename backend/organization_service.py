from fastapi import FastAPI, HTTPException, Depends, Path
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from pydantic import BaseModel
import uuid
from datetime import datetime
import requests
from typing import List
from fastapi.responses import JSONResponse


conn = mysql.connector.connect(
    host="35.199.165.211",
    port=3306,  # Replace with your actual MySQL port if it's different
    user="stephanie",
    password="staniswinata10",
    database="Comm4unity",
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

class Registration(BaseModel):
    e_id: str
    s_id:str

registrations_db = []

class Event(BaseModel):
    title: str
    date: str
    start_time: str
    end_time: str
    location: str
    type: str
    description: str
    link: str
    o_id: str #organisasinya

@app.post("/event/create_event/{o_id}")
def create_event(o_id: str, event: Event):
    # Generate a new UUID for the event id
    event_id = uuid.uuid4()

    cursor = conn.cursor()
    try:
        # Check if the organization exists
        # event_response = requests.get(f"http://localhost:8001/organization/{o_id}")
        # if event_response.status_code != 200:
        #     raise HTTPException(status_code=404, detail="Organization not found")

        query = (
            "INSERT INTO event (e_id, title, date, start_time, end_time, location, type, description, link, o_id) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        )
        event_data = (str(event_id), event.title, event.date, event.start_time, event.end_time,
                      event.location, event.type, event.description, event.link, event.o_id)
        cursor.execute(query, event_data)
        conn.commit()
      
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating event: {str(e)}")
    finally:
        cursor.close()

    return {"message": "Event created successfully"}

@app.get("/events/get_events/{user_uid}", response_model=List[Event])
def get_user_events(user_uid: str):
    cursor = conn.cursor(dictionary=True)
    try:
        query = (
            "SELECT title, date, start_time, end_time, location, type, description, link, o_id "
            "FROM event WHERE o_id = %s"
        )
        cursor.execute(query, (user_uid,))
        user_events = cursor.fetchall()
        return user_events
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user events: {str(e)}")
    finally:
        cursor.close()


# @app.post("/event/create_event")
# def create_event(event: Event):
#     # Generate a new UUID for the event id
#     event_id = uuid.uuid4()

#     cursor = conn.cursor()
#     try:
#         # Check if the organization exists
#         event_response = requests.get(f"http://localhost:8001/organization/{event.o_id}")
#         if event_response.status_code != 200:
#             raise HTTPException(status_code=404, detail="Organization not found")

#         query = (
#             "INSERT INTO event (e_id, title, date, start_time, end_time, location, type, description, link, o_id) "
#             "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
#         )
#         event_data = (str(event_id), event.title, event.date, event.start_time, event.end_time,
#                       event.location, event.type, event.description, event.link, event.o_id)
#         cursor.execute(query, event_data)
#         conn.commit()
      
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error creating registration: {str(e)}")
#     finally:
#         cursor.close()

#     return {"message": "Event created successfully"}

@app.get("/event/get_all_events")
def get_all_events():
    cursor = conn.cursor(dictionary=True)
    try:
        query = "SELECT * FROM event"
        cursor.execute(query)
        events = cursor.fetchall()
        return events
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()




@app.get("/event/{e_id}")
def read_event(e_id: str = Path(..., title="The UID of the event")):
    cursor = conn.cursor()
    try:
        query = "SELECT * FROM event WHERE e_id = %s"
        cursor.execute(query, (e_id,))
        user = cursor.fetchone()

        if user is None:
            raise HTTPException(status_code=404, detail="Event not found")

        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close() 

@app.delete("/event/delete/{e_id}")
def delete_event(e_id: str = Path(..., title="The UID of the event")):
    cursor = conn.cursor()
    try:
        # Delete from the 'event' table
        event_query = "DELETE FROM event WHERE e_id = %s"
        cursor.execute(event_query, (e_id,))
        conn.commit()

        affected_rows_event = cursor.rowcount

        if affected_rows_event == 0:
            raise HTTPException(status_code=404, detail="Event not found")

        # Delete from the 'registration' table
        registration_query = "DELETE FROM registration WHERE e_id = %s"
        cursor.execute(registration_query, (e_id,))
        conn.commit()

        affected_rows_registration = cursor.rowcount

        if affected_rows_registration == 0:
            raise HTTPException(status_code=404, detail="No registrations found for the event")

        return {"message": "Event and associated registrations deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        
from fastapi.responses import JSONResponse

# @app.get("/event/{e_id}/registration_count", response_model=dict)
# def get_registration_count_for_event(e_id: str):
#     cursor = conn.cursor(dictionary=True)
#     try:
#         count_query = "SELECT COUNT(*) as registration_count FROM registration WHERE e_id = %s"
#         cursor.execute(count_query, (e_id,))
#         registration_count = cursor.fetchone()

#         if not registration_count:
#             registration_count = {"registration_count": 0}

#         return registration_count
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error fetching registration count: {str(e)}")
#     finally:
#         cursor.close()


@app.post("/registrations/{s_id}/{e_id}")
def create_registration(e_id: str, s_id: str, reg: Registration):
    reg_id = uuid.uuid4()

    cursor = conn.cursor()
    try:
        # Check if the registration already exists for the given student and event
        check_query = "SELECT r_id FROM registration WHERE e_id = %s AND s_id = %s"
        cursor.execute(check_query, (e_id, s_id))
        existing_registration = cursor.fetchone()

        if existing_registration:
            return JSONResponse(content={"Student has already registered for this event"}, status_code=400)

        # If the registration does not exist, create a new registration
        insert_query = (
            "INSERT INTO registration (r_id, e_id, s_id) "
            "VALUES (%s, %s, %s)"
        )
        reg_data = (str(reg_id), reg.e_id, s_id)
        cursor.execute(insert_query, reg_data)
        conn.commit()
      
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating registration: {str(e)}")
    finally:
        cursor.close()

    return {"message": "Registration created successfully"}


