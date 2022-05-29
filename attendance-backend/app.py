from flask import Flask, render_template, url_for, request, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import sqlite3
from flask import jsonify
from flask import Flask, request
from flask_cors import CORS
import json
import math
from PIL import Image
import base64
import numpy as np
import io
import os
import shutil
import time
from PIL import Image
import cv2
import face_recognition

#This function takes two parameters, unknown image and the employee number, both
#sent from the frontend. If the employee number of the face in the unknown image is same as the employee number in parameter, it returns face_martch as 1 and the percentage_accuracy of the match,
#otherwise it returns face_match as 0
def face_identification(unknown_image,employee_number) :

    face_locations = face_recognition.face_locations(unknown_image)
    face_encodings = face_recognition.face_encodings(unknown_image, face_locations)
    
    resp = 'Nobody'
    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):

        matches = face_recognition.compare_faces(encodeListKnown, face_encoding)
        face_distances = face_recognition.face_distance(encodeListKnown, face_encoding)
        best_match_index = np.argmin(face_distances)
            
        if matches[best_match_index]:
            resp = classNames[best_match_index]
            percent_accuracy = face_distance_to_conf(face_distances[best_match_index])*100
        
    if(employee_number == resp) :
        return {'face_match':'1','percent_accuracy':round(percent_accuracy,3)}
    else :
        return {'face_match':'0'}

#This function recieves the face distance calculated by the 
#face_recognition module of python and returns the face-match in percentage.
#Reference - https://github.com/ageitgey/face_recognition/wiki/Calculating-Accuracy-as-a-Percentage
def face_distance_to_conf(face_distance, face_match_threshold=0.6):
    if face_distance > face_match_threshold:
        range = (1.0 - face_match_threshold)
        linear_val = (1.0 - face_distance) / (range * 2.0)
        return linear_val
    else:
        range = face_match_threshold
        linear_val = 1.0 - (face_distance / (range * 2.0))
        return linear_val + ((1.0 - linear_val) * math.pow((linear_val - 0.5) * 2, 0.2))

app = Flask(__name__)

#Connecting my application to the Sqlite-Database (facerec.db here)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///facerec.db'
db = SQLAlchemy(app)

#There are three tables in my whole database :-

#1. User Table, which stores the employee details (like email, password etc.) in each row
class User(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    empno = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), nullable=False)
    password = db.Column(db.String(200), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

#2. Attendance Table, which stores the attendance data of each employee in the
#form of a 2 columns, the first one being in_time, the second one being out_time
#The intime and outtime of each day are separated by a '|' symbol, so that they can be retrieved 
#for calculating the working hours (duration) of employee
class Attendance(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    empno = db.Column(db.String(200), nullable=False)
    in_time = db.Column(db.String(200), nullable=False)
    out_time = db.Column(db.String(200), nullable=False)

#3. Status Table, which stores the current status of the employee,
#if the employee has marked his/her in-time attendance, the status of that employee will
#become 'in', and vice-versa. This table prevents the user from marking his/her in-time or out-time
#attendance more than one time in continuation.  
class Status(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    empno = db.Column(db.String(200), nullable=False)
    emp_curr_status = db.Column(db.String(5), nullable=False)

#This function creates 2 lists
#1. The labels corresponding to all the registration images ('className' here)
#2. The list of all the loaded registration images ('image' here) 
def list_al_images() :
    image = []
    className = []

    path = 'Training_images'
  
    myList = os.listdir(path)

    for cl in myList:
        curImg = cv2.imread(f'{path}/{cl}')
        image.append(curImg)
        className.append(os.path.splitext(cl)[0])
	
    return [image,className]


#This function takes the list of registration images as paramenter
#and returns a list which has all the face_encodings corresponding to
#all the registration images.
def findEncodings(image):

    encodeList = []
    for img in image:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        encode = face_recognition.face_encodings(img)[0]
        encodeList.append(encode)
    return encodeList

classNames =   list_al_images()[1]
images =   list_al_images()[0]

encodeListKnown = findEncodings(images)

#This function recieves 2 timestamps as parameters, calculates the Duration between two time
#intervals, and returns the time duration in Hrs. This time duration is used as the working
#hours of an employee
def calculate_duration(inTimeVal,outTimeVal):

    inTime_array = inTimeVal.split(":")
    outTime_array = outTimeVal.split(":")

    inHour = int(inTime_array[0])
    inMin = int(inTime_array[1])
    inSec = int(inTime_array[2])

    outHour = int(outTime_array[0])
    outMin = int(outTime_array[1])
    outSec = int(outTime_array[2])

    final_duration = ((outHour-inHour)*3600 + (outMin-inMin)*60 + outSec-inSec)/3600
    return round(final_duration,3)
 
#This function fetches Attendance-Data from 'Attendance' Table of database (facerec.db here)
#and prepares a Date v/s Attendance Hash-Table, where the keys are the employee number of
#all employees, and values are the objects with keys as dates , and the intime, out-time and 
#duration of that day as values. An example of this Date Vs Attendance table is :
# { 'se-123': {'05/25/2022': [' 13:48:31', ' 13:48:50', 0.005], 
#             '05/27/2022': [' 14:01:37', ' 14:02:28', 0.014]}, 

# 'se2-1131': {'05/26/2022': [' 12:57:51', ' 12:58:06', 0.004]},

# 'swe-1717': {'05/26/2022': [' 17:32:34', ' 17:33:30', 0.016],
#              '05/27/2022': [' 18:41:40', ' 18:44:58', 0.055]} }
def createDateVsAttendance () :

    sqliteConnection = sqlite3.connect('facerec.db')
    cursor = sqliteConnection.cursor()
    sqlite_select_query = """SELECT * from Attendance """
    cursor.execute(sqlite_select_query)
    records = cursor.fetchall()
    attendanceRecord = {}

    for row in records:
     
        activity_chart = {}

        inTime_array = row[2].split("|")
        outTime_array = row[3].split("|")
        if(len(inTime_array) != len(outTime_array)):
            return {'message': 'You can access the data only if all employees have marked their out attendance for a day.'}
            
        for i in range(0,(len(inTime_array)-1)):

            arrin_day = inTime_array[i].split(",")
            arrout_day = outTime_array[i].split(",")
  
            activity_chart[arrin_day[0]] = [arrin_day[1],arrout_day[1],calculate_duration(arrin_day[1],arrout_day[1])]
        attendanceRecord[row[1]] = activity_chart
 
    return attendanceRecord

#This flask route recieves the registration-form data from the backend
#and returns if the registration is possible or not. If the employee number is already
#registered, it will return unique_employee_number as 0, otherwise it will add the data of
#new registered employee into the database, and return unique_employee_number as 1.
@app.route('/register', methods=['POST','GET'])
def register():
    
    if request.method == 'POST':

        registration_form_data = request.get_json()

        sqliteConnection = sqlite3.connect('facerec.db')
        cursor = sqliteConnection.cursor()

        reg_employee_number = registration_form_data['empno']
        sqlite_select_query = """SELECT * from User where empno=? """
        cursor.execute(sqlite_select_query,(reg_employee_number,))
        
        employeeAlreadyExisting = cursor.fetchall()
        cursor.close()

        if(len(employeeAlreadyExisting) == 0) :
            new_user = User(name = registration_form_data['name'],password =  registration_form_data['password'],email = registration_form_data['email'],date_created =  datetime.now(),empno=registration_form_data['empno'])

            db.session.add(new_user)
            db.session.commit()

            return jsonify({'unique_employee_number':'1'})
        else :
            return({'unique_employee_number':'0'})    


#This flask-route recieves the registration image clicked by the user
#using the webcam on the frontend, and checks if it is a valid image or not. 
#Depending on the image, this route can send three types of messaages to frontend :-

#1. If no faces are found, it will send face_present as 0. (implying user should click 
#a clear image ).

#2. If more than one faces are found, it will send face_present as 2(implying user should 
#click a solo image) .

#3. If one face is found, it will save the image to the Training images file, and it
# will append the encodeListKnown with the encodings of current image. It will also send
#face_present as 1, implying registration process is successful.
@app.route('/clickTrainingImg', methods=['POST', 'GET'])
def clickTrainingImg():

    registration_image_data = request.get_json()
    img_data_from_backend = registration_image_data['image']
    img_data_from_backend = img_data_from_backend.split(",")[1]
    img_data = img_data_from_backend.encode("ascii")	

    empno_from_backend = (registration_image_data['empno'])
    len_of_string = len(empno_from_backend)-1
    employee_number= empno_from_backend[1:len_of_string]
	
    with open("checkValidImage.png", "wb") as fh:
            fh.write(base64.decodebytes(img_data))

    unknown_image = face_recognition.load_image_file("checkValidImage.png")    
    face_locations = face_recognition.face_locations(unknown_image)

    if(len(face_locations)==0):
        return jsonify({'face_present' : 0})

    if(len(face_locations) > 1):
        return jsonify({'face_present' : 2})
    
    imgPath = "Training_images/" + employee_number + ".jpg"   
    with open(imgPath, "wb") as fh:		
        fh.write(base64.decodebytes(img_data))

    curImg = cv2.imread(imgPath)
    images.append(curImg)
    classNames.append(employee_number)
    
    img = cv2.cvtColor(curImg, cv2.COLOR_BGR2RGB)
    encode = face_recognition.face_encodings(img)[0]
    encodeListKnown.append(encode) 

    return jsonify({'face_present' : 1}) 

#This route sends the attendance data to the fronntend. 
@app.route('/reportForGraph', methods=['GET','POST'])
def reportForGraph():
 
    date_vs_employeeAttendance = createDateVsAttendance()
    return jsonify(date_vs_employeeAttendance)

#This flask route checks the validity of data entered by the admin in 
#the admin-login-form and sends login_successful as 0 or 1 accorgdingly.   
@app.route('/adminlogin', methods=['GET','POST'])
def adminlogin():

    admin_login_form_data = request.get_json()
    if(admin_login_form_data['empno'] =='admin' and admin_login_form_data['password'] == 'admin123' ):
        return jsonify({
            'login_successful':'1'
        })
    else :
        return jsonify({
            'login_successful':'0'
        })    
        
#This flask route checks the validity of data entered by the employee
#in the login-form and sends login_successful as 0 or 1 accordingly.
@app.route('/login', methods=['GET','POST'])
def login():

    employee_login_form_data = request.get_json()
    login_employee_number = employee_login_form_data['empno']

    sqliteConnection = sqlite3.connect('facerec.db')
    cursor = sqliteConnection.cursor()
    sqlite_select_query = """SELECT * from User where empno=? """
    cursor.execute(sqlite_select_query,(login_employee_number,))    
    employee_in_database = cursor.fetchall()
    cursor.close()

    if(len(employee_in_database) == 0) : 
        return jsonify({'login_successful':'0'})

    employeeDetail = employee_in_database[0]

    profile_image_b64_string=''
    profileImg_filePath = "Training_images/" + login_employee_number + ".jpg"

    with open(profileImg_filePath, "rb") as img_file:
        profile_image_b64_string = base64.b64encode(img_file.read())
    
    profile_image_b64_string = profile_image_b64_string.decode("utf-8")
 
    employee_detail_for_frontend = {
        'name':employeeDetail[1] ,
        'email' : employeeDetail[3],
        'empno' : employeeDetail[2],
        'doj' : employeeDetail[5].split(" ")[0],
        'photo' : profile_image_b64_string
    }

    if(employeeDetail[4] == employee_login_form_data['password'] ) :
        return jsonify({'login_successful':'1','employeeDetail':employee_detail_for_frontend})
    else :
        return jsonify({'login_successful':'0'})    

#This route first checks if the employee's status is 'out' or not.
#If the Status of the employee is 'out', and the image sent from the database  
#matches from the registration image, then the in-time attendance of the
#employee will be marked. Else mark-attendance will fail. The mark_attendance will 
#be sent to the frontend as 0 or 1 accordingly.  
@app.route('/markAttendance', methods=['POST', 'GET'])
def markAttendance():
        data = request.get_json()
        img_data = data['image'].split(",")[1]
        employee_number_from_frontend= data['empno']
        empIden = employee_number_from_frontend[1:len(employee_number_from_frontend)-1]
        
        img_data = img_data.encode("ascii")
        
        percent_accuracy = -1
        with open("imageToSave.png", "wb") as fh:
            fh.write(base64.decodebytes(img_data))

        unknown_image = face_recognition.load_image_file("imageToSave.png")
        
        sqliteConnection = sqlite3.connect('facerec.db')
        cursor = sqliteConnection.cursor()
        sqlite_select_query = """SELECT * from Status where empno=? """
        cursor.execute(sqlite_select_query,(empIden,))
        
        records = cursor.fetchall()
        cursor.close()

        if(len(records) == 0) :

            if(face_identification(unknown_image,empIden)['face_match'] == '1') :
                if(face_identification(unknown_image,empIden)['percent_accuracy'] < 93.5):
                    return(jsonify({'attendance_made':'0'}))   


                sqliteConnection = sqlite3.connect('facerec.db')
                cursor = sqliteConnection.cursor()
                new_user = Status(empno = empIden, emp_curr_status='in')
                db.session.add(new_user)
                db.session.commit()    
            else:
                return(jsonify({'attendance_made':'0'}))   
        
        else :
            sqliteConnection = sqlite3.connect('facerec.db')
            cursor = sqliteConnection.cursor()
            sqlite_select_query = """SELECT * from Status where empno=? """
            cursor.execute(sqlite_select_query,(empIden,))            
            records = cursor.fetchall()
            cursor.close()

            if(records[0][2] == 'in' ):
                return jsonify({'attendance_made':'2'})
            
        
        
        face_identification_result =  face_identification(unknown_image,empIden)
        if(face_identification_result['face_match'] == '0'):
            return jsonify({'attendance_made':'0'})

        

        percent_accuracy =    face_identification_result['percent_accuracy']
        if(face_identification(unknown_image,empIden)['percent_accuracy'] < 93.5):
                    return(jsonify({'attendance_made':'0'}))  

        sqliteConnection = sqlite3.connect('facerec.db')
        cursor = sqliteConnection.cursor()

        sqlite_select_query = """SELECT * from Attendance where empno=? """
        cursor.execute(sqlite_select_query,(empIden,))
        
        records = cursor.fetchall()
        cursor.close()

        now = datetime.now()
        date_time =  now.strftime("%m/%d/%Y, %H:%M:%S")
        
        if(len(records) == 0) :

            date_time = date_time + '|'
            new_log = Attendance(empno=data['empno'][1:len(data['empno'])-1 ], in_time=date_time, out_time='' )
            db.session.add(new_log)
            db.session.commit()
        else:
            init_intime = records[0][2]
            sqliteConnection = sqlite3.connect('facerec.db')
            cursor = sqliteConnection.cursor()
            sql_update_query = """Update Attendance set in_time = ? where empno = ?"""
            data = (init_intime + date_time + '|' , empIden)
            cursor.execute(sql_update_query, data)
            sqliteConnection.commit()
            cursor.close()

            sqliteConnection = sqlite3.connect('facerec.db')
            cursor = sqliteConnection.cursor()

            sql_update_query = """Update Status set emp_curr_status = ? where empno = ?"""
            data = ('in' , empIden)
            cursor.execute(sql_update_query, data)
            sqliteConnection.commit()
            cursor.close()


        return jsonify({'attendance_made':'1','percent_accuracy':round(percent_accuracy,3)})

#This route functions as the same way as the markAttendance route.
@app.route('/markAttendanceOut', methods=['POST', 'GET'])
def markAttendanceOut():

        data = request.get_json()
        img_data = data['image'].split(",")[1]
        empIden= data['empno']
        empIden = empIden[1:len(empIden)-1]
    
    
        img_data = img_data.encode("ascii")
  
        percent_accuracy = -1       
        with open("imageToSave.png", "wb") as fh:
            fh.write(base64.decodebytes(img_data))
        
        sqliteConnection = sqlite3.connect('facerec.db')
        cursor = sqliteConnection.cursor()
        sqlite_select_query = """SELECT * from Status where empno=? """
        cursor.execute(sqlite_select_query,(empIden,))        
        records = cursor.fetchall()
        cursor.close()

        if(len(records) == 0) : 
            return jsonify({'attendance_made':'2'})
             
        else :
            sqliteConnection = sqlite3.connect('facerec.db')
            cursor = sqliteConnection.cursor()

            sqlite_select_query = """SELECT * from Status where empno=? """
            cursor.execute(sqlite_select_query,(empIden,))
            
            records = cursor.fetchall()
            cursor.close()

            if(records[0][2] == 'out' ):
                return jsonify({'attendance_made':'2'})

        unknown_image = face_recognition.load_image_file("imageToSave.png")

        face_identification_result =  face_identification(unknown_image,empIden)
        if(face_identification_result['face_match'] == '0'):
            return jsonify({'attendance_made':'0'})


        percent_accuracy =    face_identification_result['percent_accuracy']
        

        if(face_identification(unknown_image,empIden)['percent_accuracy'] < 93.5):
                    return(jsonify({'attendance_made':'0'}))


        sqliteConnection = sqlite3.connect('facerec.db')
        cursor = sqliteConnection.cursor()

        sqlite_select_query = """SELECT * from Attendance where empno=? """
        cursor.execute(sqlite_select_query,(empIden,))
        
        records = cursor.fetchall()
        cursor.close()

        now = datetime.now()
        date_time =  now.strftime("%m/%d/%Y, %H:%M:%S")
        
        init_outtime = records[0][3]
        sqliteConnection = sqlite3.connect('facerec.db')
        cursor = sqliteConnection.cursor()

        sql_update_query = """Update Attendance set out_time = ? where empno = ?"""
        data = (init_outtime + date_time + '|' , empIden)
        cursor.execute(sql_update_query, data)
        sqliteConnection.commit()
        cursor.close()
            
        sqliteConnection = sqlite3.connect('facerec.db')
        cursor = sqliteConnection.cursor()

        sql_update_query = """Update Status set emp_curr_status = ? where empno = ?"""
        data = ('out' , empIden)
        cursor.execute(sql_update_query, data)
        sqliteConnection.commit()
        cursor.close()

        return jsonify({'attendance_made':'1','percent_accuracy':round(percent_accuracy,3)})

if __name__ == "__main__":
    app.run(debug=True)
