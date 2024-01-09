from fastapi import FastAPI, HTTPException, Depends, Path
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from pydantic import BaseModel
import uuid
from datetime import datetime
import requests

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

class Event(BaseModel):
    title: str
    date: str
    start_time: str
    end_time: str
    location: str
    type: str
    description: str
    link: str
    # o_id: str #organisasinya

@app.get("/event/get_all_events")
def get_all_events():
    cursor = conn.cursor(dictionary=True)
    try:
        query = "SELECT * FROM event"
        cursor.execute(query)
        events = cursor.fetchall()
        events_details = []
        print(events)
        # for event in events:
        #     id, date, start, end, location, reward, description, rlink, ilink, org_id, title = event
        #     events_details.append({
        #         "id": id, 
        #         "title":title, 
        #         "date":date,
        #         "start_time": start,
        #         "end_time": end,
        #         "location": location,
        #         "type": reward,
        #         "description": description,
        #         "regist_link":rlink,
        #         "image_link":ilink,
        #         "org_id": org_id,
        #     })
        return events
        # return events
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/event/{e_id}")
def read_event(e_id: str = Path(..., title="The UID of the event")):
    try:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM event WHERE id = %s"
        cursor.execute(query, (e_id,))
        user = cursor.fetchone()

        if user is None:
            raise HTTPException(status_code=404, detail="Event not found")

        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

