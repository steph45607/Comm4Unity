from fastapi import FastAPI, HTTPException, Depends, Path
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from pydantic import BaseModel
import uuid
from datetime import datetime
import requests
from typing import List

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="comm4unity_event"
)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    try:
        cursor = conn.cursor(dictionary=True)
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
