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
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///facerec.db'

db = SQLAlchemy(app)

class User(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    empno = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), nullable=False)
    password = db.Column(db.String(200), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

class Attendance(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    empno = db.Column(db.String(200), nullable=False)
    in_time = db.Column(db.String(200), nullable=False)
    out_time = db.Column(db.String(200), nullable=False)

class Status(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    empno = db.Column(db.String(200), nullable=False)
    emp_curr_status = db.Column(db.String(5), nullable=False)

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

@app.route('/reportForGraph', methods=['GET','POST'])
def reportForGraph():
 
    date_vs_employeeAttendance = createDateVsAttendance()
    return jsonify(date_vs_employeeAttendance)

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


if __name__ == "__main__":
    app.run(debug=True)
