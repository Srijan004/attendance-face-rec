<p align="center">
  <img height="300px"src="attendance-frontend/src/images/homepage_ss.PNG" />
</p>
<hr />

> ## Documentation
- [Demo video](https://www.youtube.com/watch?v=vMN3TqF4mh0)

> ## Tech Stack 
- ReactJS with CSS for frontend.
- Flask, opencv, and face_recognition modules of python for backend.

> ## Features
1. Register a new employee and click his/her registration image.
2. Login as employee and mark your entry-time/exit-time attendance using face-recognition.
3. View your profile as employee and search your attendance for any range of dates.
4. Assess your performance with the help of working hours vs date bar graph. 
5. Login as admin to search for the attendance data of any emoloyee, as well as for any particular date.

> ## Local Setup
- client
```sh
   cd attendance-frontend
   npm install 
   npm run start
```
- server
```sh
   cd attendance-backend
   pip install -r requirements.txt 
   python app.py
```
