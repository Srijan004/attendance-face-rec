import React from 'react'
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2'
import  {useState, useEffect} from "react"

import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';

<Chart type='line' />

// defaults.global.tooltips.enabled = false
// defaults.global.legend.position = 'bottom'

const BarChart = () => {
  
  const [labels,setLabels] = useState([]);
  const [datavals,setDatavals] = useState([]);
  
  const [arr_in,setAin] = useState([]);
  const [arr_out,setAout] = useState([]);
  
  const [final, setFinal] = useState([]);
  var obf = [];
  
  const reporter = () => {
    
    
    fetch("/report",
    {
                'method':'POST',
                 headers : {
                'Content-Type':'application/json'
              }
            }
            ).then((res) =>
            res.json().then((data) => {
              // Setting a data from api
              // setdata({
                //     name: data.Name,
                //     age: data.Age,
                //     date: data.Date,
                //     programming: data.programming,
                // });
                
                console.log("Huo getUser resp : ", data);
                setAin((data['Log'][0][2]).split("|")  );//  arr_in = data['Log'][2];
                setAout((data['Log'][0][3]).split("|") ); // arr_out = data['Log'][3];
                console.log("arr_in = ", arr_in);
                console.log("arr_out = ", arr_out);
                
                var user_arr = data['Log']; 
                for(var i=0;i<user_arr.length;i++) {
                  
                  var obj = [];
                  
                  console.log("--->", user_arr[i]);
                  var arr_inU = user_arr[i][2].split("|");  
                  var arr_outU = user_arr[i][3].split("|");
                  
                  console.log("->", arr_inU);
                  console.log("->", arr_outU);
                  
                  for(var j=0;j<arr_outU.length-1;j++) {
                    
                    
                    var [x,y]  = arr_inU[j].split(",");
                    var [p,q]  = arr_outU[j].split(",");
                    
                    console.log( "date = ", x);
                    console.log( "intime = ", y);
                    console.log( "outtime = ", q);
                    
                    obj.push([x,y,q]);
                    
                  }
                  
                  obf.push([user_arr[i][1] ,obj]);
                  
                  
                  
                  
                  
                  
                  
                  
                  
                }
                
                
                var myHash = {};
                
                // setFinal(obf);
                
                // console.log("final -> " ,final.length);
                
                
                
                var dtArr =  getDaysArray("05/10/2022","05/20/2022");
                for(var i=0;i<dtArr.length;i++) {
                  var dtv = dtArr[i];
                  var dateVal = dtv.getDate().toString();
                  var monthVal = (dtv.getMonth() + 1 ).toString();
                  var yearVal = (dtv.getFullYear()).toString();
                  console.log("------> ", dateVal," ",monthVal," ",yearVal);
                  var final_js_date = monthVal+"/"+ dateVal+ "/"+ yearVal;
                  myHash[final_js_date] = 0;
                  
                  
                  
                }
                
                if(obf.length > 0)
                {  var currUser =obf[1][1];
                  myHash[currUser[0][0].substr(1, currUser[0][0].length - 1)] = timeDuration(currUser[0][1],currUser[0][2]);
                  
                  for(var i=1;i<currUser.length;i++) {
      
      console.log("inside : ", currUser[i]);
      myHash[currUser[i][0].substr(2, currUser[i][0].length - 2)] = timeDuration(currUser[i][1],currUser[i][2]);
      
         
      }

}    console.log("my hash table : ",myHash);

     setLabels(Object.keys(myHash));
     setDatavals(Object.values(myHash));
      console.log("akm : ",labels,datavals);

    })
        );
      }
      
      
      
      
      
  //     var d1 = new Date("12/15/2022");
  //     var d2 = new Date("01/02/2023");
  //     console.log("d1 = ",d1)
      
  //     console.log("op of fn -> ", getDaysArray("05/10/2022","05/20/2022"));
  //     var dtArr =  getDaysArray("05/10/2022","05/20/2022");
  //     console.log("->dtval ->",new Date("12/15/2022"));
  //     var d1 = 4;
      
  //     var myHash = {};
  //     for(var i=0;i<dtArr.length;i++) {
      
  //     var dtv = dtArr[i];
  //     var dateVal = dtv.getDate().toString();
  //     var monthVal = (dtv.getMonth() + 1 ).toString();
  //     var yearVal = (dtv.getFullYear()).toString();
  //     console.log("------> ", dateVal," ",monthVal," ",yearVal);
  //     var final_js_date = monthVal+"/"+ dateVal+ "/"+ yearVal;
  //     myHash[final_js_date] = 0;
      
      
      
  //     }
  // if(final != undefined)         
  // {          
  // var currUser =final[0];
  //     for(var i=0;i<currUser.length;i++) {
      
  //     console.log("inside : ", currUser[i]);
      
      
  //     }
  
  
  
  // }

      var getDaysArray = function(start, end) {  
    for(var arr=[],dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt));
    }
    return arr;
};



// var t1 = "22:02:42";
// var t2 = "23:00:01";
function timeDuration(t1,t2) 
{
var t1_arr = t1.split(":");
var t2_arr = t2.split(":");

t1_arr[0] = parseInt(t1_arr[0]);
t1_arr[1] = parseInt(t1_arr[1]);
t1_arr[2] = parseInt(t1_arr[2]);

t2_arr[0] = parseInt(t2_arr[0]);
t2_arr[1] = parseInt(t2_arr[1]);
t2_arr[2] = parseInt(t2_arr[2]);

var time_diff = (t2_arr[0]-t1_arr[0])*3600 + (t2_arr[1]-t1_arr[1])*60 + t2_arr[2] - t1_arr[2];
return time_diff/3600;
}
// console.log("timediff : ",time_diff);

useEffect( () => {
  reporter();
      },  []);

  return (
    <div>

<button onClick={reporter}> Report of attendance</button>
<h1>hi</h1>
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