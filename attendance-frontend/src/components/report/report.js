import React, {useState, useEffect} from "react"

const Report = () => {
 
    const [arr_in,setAin] = useState([]);
    const [arr_out,setAout] = useState([]);

    const [final, setFinal] = useState([]);

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
            var obf = [];
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

            setFinal(obf);
            console.log("final -> " ,final);




        })
    );
    }

console.log("Hiii");
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    console.log("->date : ", date);
    date.setDate(date.getDate() + days);
    return date;
}

function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date (currentDate));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}



    useEffect( () => {
reporter();
    },  []);



    var getDaysArray = function(start, end) {
        for(var arr=[],dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
            arr.push(new Date(dt));
        }
        return arr;
    };

    console.log("->dtval ->",new Date("12/15/2022"));
    var d1 = 4;

    var t1 = "22:02:42";
    var t2 = "23:00:01";

    var t1_arr = t1.split(":");
    var t2_arr = t2.split(":");
    
    t1_arr[0] = parseInt(t1_arr[0]);
    t1_arr[1] = parseInt(t1_arr[1]);
    t1_arr[2] = parseInt(t1_arr[2]);

    t2_arr[0] = parseInt(t2_arr[0]);
    t2_arr[1] = parseInt(t2_arr[1]);
    t2_arr[2] = parseInt(t2_arr[2]);

    var time_diff = (t2_arr[0]-t1_arr[0])*3600 + (t2_arr[1]-t1_arr[1])*60 + t2_arr[2] - t1_arr[2];
    console.log("timediff : ",time_diff);



    return ( 
        
        <div>
<button onClick={reporter}> Report of attendance</button>

<div>
{
final.map( (user) => (

<div>
    <h1>{user[0]} </h1>

{
    user[1].map((u0) => (
    <>

    
        <div > Date : {u0[0]} </div>
        <div > Start time : {u0[1]} </div>
        <div > End time : {u0[2]} </div>
         

        <br />
    </>
    ) )
}

</div>


))}


</div>


        </div>


     );
}
 
export default Report;