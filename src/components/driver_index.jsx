import React, {useEffect, useState} from 'react';
import DateListItem from './date_list_item';

const DriverIndex = () => {
    const [data, setData] = useState(null);
    const fetchData = async () => {
        const res = await fetch('HOSlog.json', {
            headers: {
                'Content-Type': 'application/json', 
                'Accept': 'application/json'
            }
        });
        return res;
    };

    useEffect(() => {
        fetchData()
            .then(res => res.json())
            .then(json => {
                let datum = [];
                json.forEach(dat => datum.push(...dat.data))
                setData(datum)
            })
    }, [])

    if(!data) return null;

    // create month objects that will hold each weeks data
    // initialize each week as an array with 7 elements
    const jan = {
        week1: new Array(7),
        week2: new Array(7),
        week3: new Array(7),
        week4: new Array(7),
        week5: new Array(7), 
        week6: new Array(7)
    };
    const feb = {
        week1: new Array(7),
        week2: new Array(7),
        week3: new Array(7),
        week4: new Array(7),
        week5: new Array(7)
    };
    const march = {
        week1: new Array(7),
        week2: new Array(7),
        week3: new Array(7),
        week4: new Array(7),
        week5: new Array(7)
    };

    // create object to track hours for each week
    const janHours = { 1:0, 2:0, 3:0, 4:0, 5: 0, 6:0 };
    const febHours = { 1:0, 2:0, 3:0, 4:0, 5: 0};
    const marchHours = { 1:0, 2:0, 3:0, 4:0, 5: 0, 6:0 };


    // iterate over data  and check its month and day to assign it to its array in month object

    data.forEach((datum, idx) => {

       const month = new Date(datum.startTime).getMonth()
       const day = new Date(datum.startTime).getDay();
       const milliDiff = new Date(datum.endTime) - new Date(datum.startTime);
       const hoursWorked = Math.floor(milliDiff / 3600000);

       const dlItem = <DateListItem datum={datum} key={idx}/>;
       
       if(month === 0) {
           if(!jan.week1[6]) {
                jan.week1[day] = dlItem;
                janHours[1] += hoursWorked;
           } else if(!jan.week2[6]) {
               jan.week2[day] = dlItem;
               janHours[2] += hoursWorked;
           } else if(!jan.week3[6]) {
               jan.week3[day] = dlItem;
               janHours[3] += hoursWorked;
           } else if(!jan.week4[6]) {
               jan.week4[day] = dlItem;
               janHours[4] += hoursWorked;
           } else if(!jan.week5[6]){
               jan.week5[day] = dlItem;
               janHours[5] += hoursWorked;
           } else if(!jan.week6[6]) {
               jan.week6[day] = dlItem;
               janHours[6] += hoursWorked;
           }
       }
       if(month === 1) {
           if(!feb.week1[6]) {
            feb.week1[day] = dlItem;
            febHours[1] += hoursWorked;
           } else if(!feb.week2[6]) {
               feb.week2[day] = dlItem;
               febHours[2] += hoursWorked;
           } else if(!feb.week3[6]) {
               feb.week3[day] = dlItem;
               febHours[3] += hoursWorked;
           } else if(!feb.week4[6]) {
               feb.week4[day] = dlItem;
               febHours[4] += hoursWorked;
           } else if(!feb.week5[6]) {
               feb.week5[day] = dlItem;
               febHours[5] += hoursWorked;
           }
       }
       if(month === 2) {
             if(!march.week1[6]) {
            march.week1[day] = dlItem;
            marchHours[1] += hoursWorked;
           } else if(!march.week2[6]) {
               march.week2[day] = dlItem;
               marchHours[2] += hoursWorked;
           } else if(!march.week3[6]) {
               march.week3[day] = dlItem;
               marchHours[3] += hoursWorked;
           } else if(!march.week4[6]) {
               march.week4[day] = dlItem;
               marchHours[4] += hoursWorked;
           }
       }
    });
    
    // finally to keep code as DRY as possible, 
    //create an array and push each weeks data in jsx format ready to render

    const janWeeks = [];
    for(let week in jan) {
        const n = week.slice(week.length - 1);

        janWeeks.push(<div className={`${week}`}>
                        <ul className="date-list">
                            {jan[`${week}`]}
                            <p className="week-summary">Total Hours For Week: {janHours[n]}</p>
                        </ul>
                     </div>)
    };

    const febWeeks = [];
    for(let week in feb) {
        febWeeks.push(<div className={`${week}`}>
                        <ul className="date-list">
                            {feb[`${week}`]}
                        </ul>
                     </div>)
    };
    const marchWeeks = [];
    for(let week in march) {
        marchWeeks.push(<div className={`${week}`}>
                        <ul className="date-list">
                            {march[`${week}`]}
                        </ul>
                     </div>)
    };


    return(
        <div className="driver-index">
            <div className="month-container">
                <h5 className="month-head">January</h5>
                {janWeeks}
            </div>
            <div className="month-container">
                <h5 className="month-head">February</h5>
                {febWeeks}
            </div>
            <div className="month-container">
                <h5 className="month-head">March</h5>
                {marchWeeks}
            </div>
        </div>
    )
};

export default DriverIndex;