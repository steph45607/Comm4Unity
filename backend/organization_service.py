from fastapi import FastAPI, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from pydantic import BaseModel
import uuid
from passlib.context import CryptContext

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="comm4unity_organization"
)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Organization(BaseModel):
    name: str
    email: str
    password: str

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@app.post("/organization/sign-up")
def organization_signup(org: Organization):
    try:
        cursor = conn.cursor(dictionary=True)
        check_query = "SELECT * FROM organization WHERE email = %s"
        cursor.execute(check_query, (org.email,))
        existing_org = cursor.fetchone()

        if existing_org:
            raise HTTPException(status_code=400, detail="Organization with this email already exists")

        uid = str(uuid.uuid4())
        hashed_password = pwd_context.hash(org.password)

        insert_query = "INSERT INTO organization (o_id, name, email, password) VALUES (%s, %s, %s, %s)"
        cursor.execute(insert_query, (uid, org.name, org.email, hashed_password))
        conn.commit()

        return {"message": "Organization created successfully", "uid": uid}
    except Exception as e:
        print(f"Exception: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()

@app.get("/organization/{org_id}")
def read_organization(org_id: str = Path(..., title="The ID of the organization")):
    try:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM organization WHERE o_id = %s"
        cursor.execute(query, (org_id,))
        organization = cursor.fetchone()

        if organization is None:
            raise HTTPException(status_code=404, detail="Organization not found")

        return organization
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()


# @app.get("/organization/get_all")
# def read_database():
#     try:
#         cursor = conn.cursor(dictionary=True)
#         query = "SELECT *  FROM organization"
#         cursor.execute(query)
#         result = cursor.fetchall()

#         return result
#     except mysql.connector.Error as db_error:
#         raise HTTPException(status_code=500, detail=f"Database error: {str(db_error)}")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
#     finally:
#         cursor.close()

@app.post("/organization/log-in")
def organization_login(org: Organization):
    try:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM organization WHERE email = %s"
        cursor.execute(query, (org.email,))
        organization = cursor.fetchone()

        if organization is None or not pwd_context.verify(org.password, organization["password"]):
            raise HTTPException(status_code=401, detail="Invalid credentials")


        return {"message": "Login successful", "o_id": organization["o_id"]}
    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        cursor.close()
