import React from 'react'
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2'
import  {useState, useEffect} from "react"
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';

<Chart type='line' />

const BarChart = () => {
  
  const [labels,setLabels] = useState([]);
  const [datavals,setDatavals] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [empNo, setEmpNo] = useState('tvo-2801');

  const [arr_in,setAin] = useState([]);
  const [arr_out,setAout] = useState([]);
  
  const [final, setFinal] = useState([]);
  var obf = [];
  
  const reporter = () => {
    
    
    fetch("/reportForGraph",
    {
                'method':'POST',
                 headers : {
                'Content-Type':'application/json'
              }
            }
            ).then((res) =>
            res.json().then((data) => {
         
                console.log("hash data from flask : ", data)
             
                

                var myHash = {};
              
                var currUser = data[empNo];                
                var dtArr =  getDaysArray(startDate,endDate);
                for(var i=0;i<dtArr.length;i++) {
                  var MyDate = dtArr[i];

              var MyDateString =  ('0' + (MyDate.getMonth()+1)).slice(-2)+ '/'
             +('0' + MyDate.getDate()).slice(-2)  + '/'
             + MyDate.getFullYear();

             if(currUser[MyDateString]) myHash[MyDateString] = currUser[MyDateString][2];
             else myHash[MyDateString] = 0;
                  
                  
                  
                }
                
   

 console.log("my hash table : ",myHash);

     setLabels(Object.keys(myHash));
     setDatavals(Object.values(myHash));
      console.log("akm : ",labels,datavals);

    })
        );
      }
      
      
      
    
      var getDaysArray = function(start, end) {  
    for(var arr=[],dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt));
    }
    return arr;
};



useEffect( () => {
  reporter();
      },  []);

  return (
    <div>

<button onClick={reporter}> Report of attendance</button>
<h1>Stard Date : </h1>
<DatePicker
placeholderText='Start Date'
selected={startDate}
onChange={date => setStartDate(date)}
showYearDropdown
scrollableMonthYearDropdown

/>
<br />

<h1>End Date</h1>
<DatePicker
placeholderText='End Date'
selected={endDate}
onChange={date => setEndDate(date)}
showYearDropdown
scrollableMonthYearDropdown

/>

<br />
<br />
<input type="text" placeholder='Enter Employee Number' value={empNo} onChange={e => setEmpNo(e.target.value) }/>
<div>


      <Bar
        data={{
          labels: labels,
          datasets: [
            {
              label: 'No of working hours',
              data: datavals,
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                // 'rgba(75, 192, 192, 0.2)',
                // 'rgba(153, 102, 255, 0.2)',
                // 'rgba(255, 159, 64, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
            }
            // ,
            // {
            //   label: 'Quantity',
            //   data: [47, 52, 67, 58, 9, 50],
            //   backgroundColor: 'orange',
            //   borderColor: 'red',
            // },
          ],
        }}
        
        height={400}
        width={600}
        options={{
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
          legend: {
            labels: {
              fontSize: 25,
            },
          },
        }}
      />
</div>
    </div>
  )
}

export default BarChart