# from fastapi import FastAPI, HTTPException, Depends
# from fastapi.middleware.cors import CORSMiddleware
# import mysql.connector
# from pydantic import BaseModel
# from datetime import datetime

# conn = mysql.connector.connect(
#     host="localhost",
#     user="root",
#     password="",
#     database="comm4unity"
# )

# app = FastAPI()
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# class Student(BaseModel):
#     id: int
#     name: str
#     email: str
#     password: str
#     batch: int

# class Organization(BaseModel):
#     id:int
#     name:str
#     email:str
#     password:str


# @app.get("/")
# def read_root():
#     return {"Hello": "World"}

# @app.post("/student/sign-up")
# def student_signup(stud: Student):
#     try:
#         cursor = conn.cursor(dictionary=True)
#         query= (
#             "INSERT INTO students (s_id,name,email,pass,batch) VALUES (%s,%s,%s,%s,%s)"
#         )
#         cursor.execute(query,(stud.id,stud.name,stud.email,stud.password,stud.batch))
#         conn.commit()
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
#     finally:
#         cursor.close()

# @app.get("/student/get_all")
# def read_database():
#     try:
#         cursor = conn.cursor(dictionary=True)
#         query = (
#            "SELECT * from students"
#         )
#         cursor.execute(query)
#         result = cursor.fetchall()

#         if result is None:
#             raise HTTPException(status_code=404, detail="Data not found")

#         return result
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
#     finally:
#         cursor.close()

# @app.post("/student/log-in")
# def student_login(stud: Student):
#     try:
#         cursor = conn.cursor(dictionary=True)
#         query = (
#             "SELECT * FROM students WHERE email = %s AND pass = %s"
#         )
#         cursor.execute(query, (stud.email, stud.password))
#         result = cursor.fetchone()

#         if result is None:
#             raise HTTPException(status_code=401, detail="Invalid credentials")
#         return result
#     except mysql.connector.Error as e:
#         raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
#     finally:
#         cursor.close()



# # @app.post("/api/create_transaction")
# # def create_user(trans: Transaction):
# #     # Extract date, hour, and minute
# #     current_datetime = datetime.now()
# #     date_part = current_datetime.date()
# #     hour_part = current_datetime.hour
# #     minute_part = current_datetime.minute

# #     hour_minute = f"{hour_part} : {minute_part}"
    
# #     try:
# #         cursor = conn.cursor(dictionary=True)
# #         query = (
# #             "INSERT INTO data "
# #             "(id, productID, productName, amount, customerName, status, transactionDate, createBy, createOn) "
# #             "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
# #         )
# #         cursor.execute(query, (trans.id, trans.productID, trans.productName, trans.amount, trans.customerName, trans.status, date_part, trans.createBy, hour_minute))
# #         conn.commit() 
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=str(e))
# #     finally:
# #         cursor.close()

# # from typing import Optional

# # class UpdateStudent(BaseModel):
# #     id: Optional[int] = None
# #     productID: Optional[int] = None   
# #     productName: Optional[str] = None
# #     amount: Optional[int] = None
# #     customerName: Optional[str] = None
# #     status: Optional[int] = None
# #     transactionDate: Optional[datetime] = None
# #     createBy: Optional[str] = None
# #     createOn: Optional[datetime] = None

# # @app.get("/api/get")
# # def read_database():
# #     try:
# #         cursor = conn.cursor(dictionary=True)
# #         query = (
# #             "SELECT d.id, d.productID, d.productName, d.amount, "
# #             "d.customerName, s.name as status, d.transactionDate, "
# #             "d.createBy, d.createOn "
# #             "FROM data d "
# #             "JOIN status s ON d.status = s.id "
# #         )
# #         cursor.execute(query)
# #         result = cursor.fetchall()

# #         if result is None:
# #             raise HTTPException(status_code=404, detail="Data not found")

# #         return result
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=str(e))
# #     finally:
# #         cursor.close()

# # # have to specify the id
# # @app.get("/api/get/{data_id}")
# # def read_database(data_id):
    
# #     try:
# #         cursor = conn.cursor(dictionary=True)
# #         query = (
# #             "SELECT d.id, d.productID, d.productName, d.amount, "
# #             "d.customerName, s.name as status, d.transactionDate, "
# #             "d.createBy, d.createOn "
# #             "FROM data d "
# #             "JOIN status s ON d.status = s.id "
# #             "WHERE d.id = %s"
# #         )
# #         cursor.execute(query, (data_id,))
# #         result = cursor.fetchone()

# #         if result is None:
# #             raise HTTPException(status_code=404, detail="Data not found")

# #         return result
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=str(e))
# #     finally:
# #         cursor.close()


# # @app.post("/api/create_transaction")
# # def create_user(trans: Transaction):
# #     # Extract date, hour, and minute
# #     current_datetime = datetime.now()
# #     date_part = current_datetime.date()
# #     hour_part = current_datetime.hour
# #     minute_part = current_datetime.minute

# #     hour_minute = f"{hour_part} : {minute_part}"
    
# #     try:
# #         cursor = conn.cursor(dictionary=True)
# #         query = (
# #             "INSERT INTO data "
# #             "(id, productID, productName, amount, customerName, status, transactionDate, createBy, createOn) "
# #             "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
# #         )
# #         cursor.execute(query, (trans.id, trans.productID, trans.productName, trans.amount, trans.customerName, trans.status, date_part, trans.createBy, hour_minute))
# #         conn.commit() 
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=str(e))
# #     finally:
# #         cursor.close()
# # # @app.delete("/delete/{user}")

# # @app.put("/update/{data_id}")
# # def update_transaction(update: UpdateTransaction, data_id: int):
# #     try:
# #         cursor = conn.cursor(dictionary=True)
# #         query = (
# #             "UPDATE data "
# #             "SET productID = COALESCE(%s, productID), "
# #             "productName = COALESCE(%s, productName), "
# #             "amount = COALESCE(%s, amount), "
# #             "customerName = COALESCE(%s, customerName), "
# #             "status = COALESCE(%s, status), "
# #             "transactionDate = COALESCE(%s, transactionDate), "
# #             "createBy = COALESCE(%s, createBy), "
# #             "createOn = COALESCE(%s, createOn) "
# #             "WHERE id = %s"
# #         )
# #         cursor.execute(
# #             query,
# #             (
# #                 update.productID,
# #                 update.productName,
# #                 update.amount,
# #                 update.customerName,
# #                 update.status,
# #                 update.transactionDate,
# #                 update.createBy,
# #                 update.createOn,
# #                 data_id,
# #             ),
# #         )
# #         conn.commit()
# #         return {"message": "Transaction updated successfully"}
# #     except Exception as e:
# #         raise HTTPException(status_code=500, detail=str(e))
# #     finally:
# #         cursor.close()
