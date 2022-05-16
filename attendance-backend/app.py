from flask import Flask, render_template, url_for, request, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import sqlite3
from flask import jsonify
from flask import Flask, request
from flask_cors import CORS
import json
# from face_rec import FaceRec
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

print(datetime.now())

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'

db = SQLAlchemy(app)


class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(200), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return '<Task %r>' % self.id


class User(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    empno = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), nullable=False)
    password = db.Column(db.String(200), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    
    
    
    
    def __repr__(self):
        return '<Task %r>' % self.id


class Attendance(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    empno = db.Column(db.String(200), nullable=False)
    in_time = db.Column(db.String(200), nullable=False)
    out_time = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return '<Task %r>' % self.id

class Status(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    empno = db.Column(db.String(200), nullable=False)
    emp_curr_status = db.Column(db.String(5), nullable=False)
    
    def __repr__(self):
        return '<Task %r>' % self.id


time_duration=0
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
 
checkHash = {
    "ok":1
}

print("chh",checkHash)

sqliteConnection = sqlite3.connect('test.db')
cursor = sqliteConnection.cursor()
print("Connected to SQLite")    
sqlite_select_query = """SELECT * from Attendance """

cursor.execute(sqlite_select_query)

records = cursor.fetchall()
# print("-->", records)

print("Total rows are:  ", len(records))
print("Printing each row")

hashMap = {}
for row in records:
    print(row)
    print("Id: ", row[0])
    print("Empno: ", row[1])
    print("Intime: ", row[2])
    print("Out-time: ", row[3])
    
    

    activity_chart = {}

    inTime_array = row[2].split("|")
    outTime_array = row[3].split("|")

    print("ita -> ", inTime_array, "ota ->" ,outTime_array)

    for i in range(0,(len(inTime_array)-1)):

        arrin_day = inTime_array[i].split(",")
        arrout_day = outTime_array[i].split(",")

        print("inside loop aid",arrin_day)
        print("inside loop aod",arrout_day)

        activity_chart[arrin_day[0]] = [arrin_day[1],arrout_day[1],calculate_duration(arrin_day[1],arrout_day[1])]


    
    

    hashMap[row[1]] = activity_chart
    
    print("\n")

print("the hashmap", hashMap)
# quit();    

# READING LOGIC ###############################
# try:
#     sqliteConnection = sqlite3.connect('test.db')
#     cursor = sqliteConnection.cursor()
#     print("Connected to SQLite")


    # sqlite_select_query = """SELECT * from User where empno='hw-1311'  """
    

    # cursor.execute(sqlite_select_query)
    
    # records = cursor.fetchall()
    # print("-->", records)

    # print("Total rows are:  ", len(records))
    # print("Printing each row")
    # for row in records:
    #     print("Id: ", row[0])
    #     print("Name: ", row[1])
    #     print("Empno: ", row[2])
    #     print("Email: ", row[3])
    #     print("Password: ", row[4])
    #     print("Date-created: ", row[5])
        
    #     print("\n")

    
#     cursor.close()

# except sqlite3.Error as error:
#     print("Failed to read data from sqlite table", error)
    
# finally:
#     if sqliteConnection:
        
#         sqliteConnection.close()
#         print("The SQLite connection is closed")



# UPDATION LOGIC #########################
# try:
#     sqliteConnection = sqlite3.connect('test.db')
#     cursor = sqliteConnection.cursor()
#     print("Connected to SQLite")

#     sql_update_query = """Update User set empno = 'hw-1311'  where empno = 'hw-1234'"""
#     cursor.execute(sql_update_query)
#     sqliteConnection.commit()
#     print("Record Updated successfully ")
#     cursor.close()

# except sqlite3.Error as error:
#     print("Failed to update sqlite table", error)
# finally:
#     if sqliteConnection:
#         sqliteConnection.close()
#         print("The SQLite connection is closed")

   
    
    
        




# new_user = User(name = "Srijan",password =  "1234",email = "abc@123",date_created =  datetime.now(),empno=11)


# try:
#     db.session.add(new_user)
#     db.session.commit()
#     redirect('/')

# except:
#     print('data unable to be added to db')
# jkkk

@app.route('/register', methods=['POST','GET'])
def register():
    
    if request.method == 'POST':


        data = request.get_json()
        print(data['empno'])

    
        sqliteConnection = sqlite3.connect('test.db')
        cursor = sqliteConnection.cursor()
        print("Connected to SQLite")

        x = data['empno']


        sqlite_select_query = """SELECT * from User where empno=? """
        cursor.execute(sqlite_select_query,(x,))
        
        records = cursor.fetchall()
        print("-->", records)

        cursor.close()

        # response = flask.make_response({"e" : "gg"})
        # response.headers['content-type'] = 'application/octet-stream'
        # return response

        if(len(records) == 0) :
            new_user = User(name = data['name'],password =  data['password'],email = data['email'],date_created =  datetime.now(),empno=data['empno'])
            db.session.add(new_user)
            db.session.commit()
             

            return jsonify({'empno':'1'})

        else :
            return({'empno':'0'})    





        

        # print("Total rows are:  ", len(records))
        # print("Printing each row")
        # for row in records:
        #     print("Id: ", row[0])
        #     print("Name: ", row[1])
        #     print("Email: ", row[2])
        #     print("JoiningDate: ", row[3])
        #     print("Salary: ", row[4])
        #     print("\n")

        



            # task = User.query.get_or_404(username=data['name'])
            # print("dup found", task)






        # new_user = User(username = data['name'],password =  data['password'],email = data['email'] ,date_created =  datetime.now(),roll = data['roll'])
        
        # try:
        #     db.session.add(new_user)
        #     db.session.commit()
        #     redirect('/')

        # except:
        #     print('data unable to be added to db')
            



        # return data



# ------------------------------------------------------------
# WEBCAPTURE AND FACE RECOGNITION STARTS


def markMyAttendance(name):
    with open('Attendance.csv','r+') as f:
							myDataList = f.readlines()
							nameList = []
							for line in myDataList:
								entry = line.split(',')
								nameList.append(entry[0])
    
							now = datetime.now()
							dtString = now.strftime('%H:%M:%S')
							f.writelines(f'\n {name},{dtString}  \n')


path = 'Training_images'
images = []
classNames = []
myList = os.listdir(path)
print( "mylist = " ,myList)
for cl in myList:

	print("cl = ", cl)
	
	curImg = cv2.imread(f'{path}/{cl}')

    
	images.append(curImg)
    
	classNames.append(os.path.splitext(cl)[0])

	
    
print(classNames)


def findEncodings(images):
    encodeList = []


    for img in images:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        encode = face_recognition.face_encodings(img)[0]
        encodeList.append(encode)
    return encodeList


encodeListKnown = findEncodings(images)
print("encode - >",len(encodeListKnown))
print('Encoding Complete')


@app.route('/clickTrainingImg', methods=['POST', 'GET'])
def clickTrainingImg():

    data = request.get_json()
    print("-->",  data['image'])
    x = data['image']
    x = x.split(",")[1]
    print("x = ",x)
    
	
    

	
    img_data = x

	
    img_data = img_data.encode("ascii")
    y = (data['empno'])
    l = len(y)-1
    z= y[1:l]
	
    
    
    with open("Training_images/" + z + ".jpg", "wb") as fh:

		
        fh.write(base64.decodebytes(img_data))

    return data    


@app.route('/markAttendance', methods=['POST', 'GET'])
def markAttendance():



        data = request.get_json()
        x = data['image'].split(",")[1]
        empIden= data['empno']
        empIden = empIden[1:len(empIden)-1]
    
        print("empIden ::::: ", empIden)


        img_data = x 

        img_data = img_data.encode("ascii")


        # print("****",img_data)

        
        with open("imageToSave.png", "wb") as fh:
            fh.write(base64.decodebytes(img_data))


        sqliteConnection = sqlite3.connect('test.db')
        cursor = sqliteConnection.cursor()
        print("Connected to SQLite")

        sqlite_select_query = """SELECT * from Status where empno=? """
        cursor.execute(sqlite_select_query,(empIden,))
        
        records = cursor.fetchall()
        print("-->", records)
        cursor.close()

        if(len(records) == 0) :
            new_user = Status(empno = empIden, emp_curr_status='in')
            db.session.add(new_user)
            db.session.commit()
             
        else :


            sqliteConnection = sqlite3.connect('test.db')
            cursor = sqliteConnection.cursor()
            print("Connected to SQLite")



            sqlite_select_query = """SELECT * from Status where empno=? """
            cursor.execute(sqlite_select_query,(empIden,))
            
            records = cursor.fetchall()
            print("-->", records)

            cursor.close()

            if(records[0][2] == 'in' ):
                return jsonify({'login':'2'})
            
            else :
                pass
            








            
        

        unknown_image = face_recognition.load_image_file("imageToSave.png")
        
        face_locations = face_recognition.face_locations(unknown_image)
        face_encodings = face_recognition.face_encodings(unknown_image, face_locations)
        
        resp = 'Nobody'
        for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):

            matches = face_recognition.compare_faces(encodeListKnown, face_encoding)
            name = "Nobody"
            
            face_distances = face_recognition.face_distance(encodeListKnown, face_encoding)
            best_match_index = np.argmin(face_distances)

            if matches[best_match_index]:
                resp = classNames[best_match_index]
        
        
        print("ans = **** ", resp)	
        if resp != 'Nobody':
            markMyAttendance(resp)

        # imgS = resize("imageToSave.png", (0, 0), None, 0.25, 0.25)
        
        # imgS = cvtColor("imageToSave.png", cv2.COLOR_BGR2RGB)

        
        
        # facesCurFrame = face_recognition.face_locations(imgS)
    
        
        # encodesCurFrame = face_recognition.face_encodings(imgS, facesCurFrame)

        
        # for encodeFace, faceLoc in zip(encodesCurFrame, facesCurFrame):
        # 	matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
        # 	faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)
        # 	matchIndex = np.argmin(faceDis)

        # 	if matches[matchIndex]:
        # 		name = classNames[matchIndex].upper()
        # 		print("answer -> ", name)

        print(empIden, "-------", resp)


        if(empIden == resp) :

            sqliteConnection = sqlite3.connect('test.db')
            cursor = sqliteConnection.cursor()
            print("Connected to SQLite")



            sqlite_select_query = """SELECT * from Attendance where empno=? """
            cursor.execute(sqlite_select_query,(empIden,))
            
            records = cursor.fetchall()
            print("-->", records)

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
                sqliteConnection = sqlite3.connect('test.db')
                cursor = sqliteConnection.cursor()
                print("Connected to SQLite")

                sql_update_query = """Update Attendance set in_time = ? where empno = ?"""
                data = (init_intime + date_time + '|' , empIden)
                cursor.execute(sql_update_query, data)
                sqliteConnection.commit()
                print("Record Updated successfully")
                cursor.close()

                sqliteConnection = sqlite3.connect('test.db')
                cursor = sqliteConnection.cursor()
                print("Connected to SQLite")

                sql_update_query = """Update Status set emp_curr_status = ? where empno = ?"""
                data = ('in' , empIden)
                cursor.execute(sql_update_query, data)
                sqliteConnection.commit()
                print("Record Updated successfully")
                cursor.close()

            return jsonify({'login':'1'})
        
        else :
            return jsonify({'login':'0'})

        
@app.route('/markAttendanceOut', methods=['POST', 'GET'])
def markAttendanceOut():

        data = request.get_json()
        x = data['image'].split(",")[1]
        empIden= data['empno']
        empIden = empIden[1:len(empIden)-1]
        print("empIden ::::: ", empIden)

        img_data = x
    
        img_data = img_data.encode("ascii")


        # print("****",img_data)

        
        with open("imageToSave.png", "wb") as fh:
            fh.write(base64.decodebytes(img_data))
        
        sqliteConnection = sqlite3.connect('test.db')
        cursor = sqliteConnection.cursor()
        print("Connected to SQLite")

        x = data['empno']


        sqlite_select_query = """SELECT * from Status where empno=? """
        cursor.execute(sqlite_select_query,(empIden,))
        
        records = cursor.fetchall()
        print("-->", records)
        cursor.close()

        if(len(records) == 0) :
            # Mark attendance in first 
            return jsonify({'login':'2'})
             
        else :


            sqliteConnection = sqlite3.connect('test.db')
            cursor = sqliteConnection.cursor()
            print("Connected to SQLite")


            sqlite_select_query = """SELECT * from Status where empno=? """
            cursor.execute(sqlite_select_query,(empIden,))
            
            records = cursor.fetchall()
            print("-->", records)

            cursor.close()

            if(records[0][2] == 'out' ):
                # Mark in attendance first
                return jsonify({'login':'2'})
            
            else :
                pass
        






            
        

        unknown_image = face_recognition.load_image_file("imageToSave.png")
        
        face_locations = face_recognition.face_locations(unknown_image)
        face_encodings = face_recognition.face_encodings(unknown_image, face_locations)
        
        resp = 'Nobody'
        for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):

            matches = face_recognition.compare_faces(encodeListKnown, face_encoding)
            name = "Nobody"
            
            face_distances = face_recognition.face_distance(encodeListKnown, face_encoding)
            best_match_index = np.argmin(face_distances)

            if matches[best_match_index]:
                resp = classNames[best_match_index]
        
        
        print("ans = **** ", resp)	
        if resp != 'Nobody':
            markMyAttendance(resp)

        # imgS = resize("imageToSave.png", (0, 0), None, 0.25, 0.25)
        
        # imgS = cvtColor("imageToSave.png", cv2.COLOR_BGR2RGB)

        
        
        # facesCurFrame = face_recognition.face_locations(imgS)
    
        
        # encodesCurFrame = face_recognition.face_encodings(imgS, facesCurFrame)

        
        # for encodeFace, faceLoc in zip(encodesCurFrame, facesCurFrame):
        # 	matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
        # 	faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)
        # 	matchIndex = np.argmin(faceDis)

        # 	if matches[matchIndex]:
        # 		name = classNames[matchIndex].upper()
        # 		print("answer -> ", name)

        print(empIden, "-------", resp)


        if(empIden == resp) :

            sqliteConnection = sqlite3.connect('test.db')
            cursor = sqliteConnection.cursor()
            print("Connected to SQLite")



            sqlite_select_query = """SELECT * from Attendance where empno=? """
            cursor.execute(sqlite_select_query,(empIden,))
            
            records = cursor.fetchall()
            print("-->", records)

            cursor.close()

            now = datetime.now()
            date_time =  now.strftime("%m/%d/%Y, %H:%M:%S")
            
            init_outtime = records[0][3]
            sqliteConnection = sqlite3.connect('test.db')
            cursor = sqliteConnection.cursor()
            print("Connected to SQLite")

            sql_update_query = """Update Attendance set out_time = ? where empno = ?"""
            data = (init_outtime + date_time + '|' , empIden)
            cursor.execute(sql_update_query, data)
            sqliteConnection.commit()
            print("Record Updated successfully")
            cursor.close()

                
            sqliteConnection = sqlite3.connect('test.db')
            cursor = sqliteConnection.cursor()
            print("Connected to SQLite")

            sql_update_query = """Update Status set emp_curr_status = ? where empno = ?"""
            data = ('out' , empIden)
            cursor.execute(sql_update_query, data)
            sqliteConnection.commit()
            print("Record Updated successfully")
            cursor.close()

            return jsonify({'login':'1'})
        
        else :
            return jsonify({'login':'0'})
    


        

@app.route('/report', methods=['GET','POST'])
def getUser():

    sqliteConnection = sqlite3.connect('test.db')
    cursor = sqliteConnection.cursor()
    print("Connected to SQLite")


    sqlite_select_query = """SELECT * from Attendance """
    

    cursor.execute(sqlite_select_query)
    
    records = cursor.fetchall()
    print("-->", records)

    print("Total rows are:  ", len(records))
    print("Printing each row")
    for row in records:
        print(row)
        # print("Id: ", row[0])
        # print("Name: ", row[1])
        # print("Empno: ", row[2])
        # print("Email: ", row[3])
        # print("Password: ", row[4])
        # print("Date-created: ", row[5])
        
        print("\n")

    
#     cursor.close()



    return jsonify({
        "Log": records 
        })




@app.route('/reportForGraph', methods=['GET','POST'])
def reportForGraph():

    
    return jsonify(hashMap)
         

@app.route('/login', methods=['GET','POST'])
def login():

    data = request.get_json()
    print(data)

    sqliteConnection = sqlite3.connect('test.db')
    cursor = sqliteConnection.cursor()
    print("Connected to SQLite")

    x = data['empno']

    sqlite_select_query = """SELECT * from User where empno=? """
    cursor.execute(sqlite_select_query,(x,))
    
    records = cursor.fetchall()
    print("-->", records)

    cursor.close()




    if(len(records) == 0) :
            

        return jsonify({'poss':'0'})

    else :

        if(records[0][4] == data['password'] ) :
            return jsonify({'poss':'1'})
        else :
            return jsonify({'poss':'0'})    


@app.route('/adminlogin', methods=['GET','POST'])
def adminlogin():

    data = request.get_json()
    print(data)

    if(data['empno'] =='admin' and data['password'] == 'admin123' ):
        return jsonify({
            'ok':'1'
        })
    else :
        return jsonify({
            'ok':'0'
        })    

    return data

    # if(len(records) == 0) :
            

    #     return jsonify({'poss':'0'})

    # else :

    #     if(records[0][4] == data['password'] ) :
    #         return jsonify({'poss':'1'})
    #     else :
    #         return jsonify({'poss':'0'})    
            
           


@app.route('/', methods=['POST', 'GET'])
def index():
    if request.method == 'POST':
        task_content = request.form['content']
        new_task = Todo(content=task_content)

        try:
            db.session.add(new_task)
            db.session.commit()
            return redirect('/')
        except:
            return 'There was an issue adding your task'

    else:
        tasks = Todo.query.order_by(Todo.date_created).all()
        return render_template('index.html', tasks=tasks)


@app.route('/delete/<int:id>')
def delete(id):
    task_to_delete = Todo.query.get_or_404(id)

    try:
        db.session.delete(task_to_delete)
        db.session.commit()
        return redirect('/')
    except:
        return 'There was a problem deleting that task'

@app.route('/update/<int:id>', methods=['GET', 'POST'])
def update(id):
    task = Todo.query.get_or_404(id)

    if request.method == 'POST':
        task.content = request.form['content']

        try:
            db.session.commit()
            return redirect('/')
        except:
            return 'There was an issue updating your task'

    else:
        return render_template('update.html', task=task)




if __name__ == "__main__":
    app.run(debug=True)
