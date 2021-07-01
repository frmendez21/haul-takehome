import React, {useEffect, useState} from 'react';
import DateListItem from './date_list_item';

const DriverIndex = () => {
    // using component's state to store the data retreived from json document
    const [data, setData] = useState(null);
    
    // create async function to fetch data from file
    const fetchData = async () => {
        const res = await fetch('HOSlog.json', {
            headers: {
                'Content-Type': 'application/json', 
                'Accept': 'application/json'
            }
        });
        return res;
    };

    // once data is fetched parse to json 
    useEffect(() => {
        fetchData()
            .then(res => res.json())
            .then(json => {
                // iterate over json result and push json result[i].data (deconstructed) to new array, set State
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
        week3: new Array(7)
    };

    // create object to track hours for each week
    const janHours = { 1:0, 2:0, 3:0, 4:0, 5: 0, 6:0 };
    const febHours = { 1:0, 2:0, 3:0, 4:0, 5: 0};
    const marchHours = { 1:0, 2:0, 3:0};


    // iterate over data  and check its month and day to assign it to its array in month object

    data.forEach((datum, idx) => {
    
       const startTime = new Date(datum.startTime);
       const endTime = new Date(datum.endTime);
       
       const month = startTime.getMonth()
       const day = startTime.getDay();

       // calculate difference between end and start time (added subtraction of offDutyDuration to make numbers more realistic)
       const milliDiff = (endTime - startTime) - datum.dutyStatusDurations.offDutyDurationMs;
       const hoursDiff = milliDiff / 3600000;

       // convert onDutyDurationMs from milliseconds to hours
       const dutyMs = (datum.dutyStatusDurations.onDutyDurationMs / 3600000);
        
       // if dutyDurationMs is 0 use hoursDiff else use dutyMs
       const hoursWorked = dutyMs === 0 ? hoursDiff : dutyMs;
       const dailyPay = hoursWorked * 22;

       const dlItem = <DateListItem startTime={startTime} endTime={endTime} hours={hoursWorked} dailyPay={dailyPay} key={idx} />;
       
       // if month is 0 (Jan) 
       if(month === 0) {
           // if the last value of the array in the Jan object is falsy,
           // that means we haven't ended the week or (filled the last position of the array)
           // this means we can add this DateListItem to the week's array, position in week's array dependent on day
           // else try the next week
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
           } 
       }
    });
    
    
    //create an array and push each weeks data in jsx format ready to render
    let i = 0;
    const janWeeks = [];

    for(let week in jan) {
        // set warning flags to false
        let mediumWarning = false;
        let highWarning = false;

        // if weeks hours exceed 80% trigger warning, over 100% trigger higher warning
        const n = week.slice(week.length - 1);
        const currWeekHours = janHours[n];

        if(currWeekHours >= 56 && currWeekHours < 70) mediumWarning = true;
        if(currWeekHours >= 70) highWarning = true;
        
        // calculate totalPay
        const overTimeHours = currWeekHours > 40 ? currWeekHours - 40 : 0;
        const regPay = overTimeHours > 0 ? 40 * 22 : currWeekHours * 22;
        const otPay = overTimeHours * 33;
        const totalPay = regPay + otPay;
        i++
        // push the data to the janWeeks array
        janWeeks.push(<div key={`jan-${i}`}className={`${week}`}>
                        <ul className="date-list">
                            {jan[`${week}`]}
                            <div className="summary">
                                <p className="total-hours">Total Hours For Week: {currWeekHours.toFixed(2)}</p>
                                <p>Regular Pay: {regPay.toFixed(2)}</p>
                                <p>Overtime Pay: {otPay.toFixed(2)}</p>
                                <p>Weekly Pay: {totalPay.toFixed(2)} </p>
                                {mediumWarning && <p className="med-warning">Warning driver within 80% of 70 hours worked this week</p>}
                                {highWarning && <p className="high-warning">Warning driver exceeded 70 hours worked this week</p>}
                            </div>
                        </ul>
                     </div>)
    };

    const febWeeks = [];
    for(let week in feb) {
        // set warning flags to false
        let mediumWarning = false;
        let highWarning = false;

        // if weeks hours exceed 80% trigger warning, over 100% trigger higher warning
        const n = week.slice(week.length - 1);
        const currWeekHours = febHours[n];

        if(febHours[n] >= 56 && febHours[n] < 70) mediumWarning = true;
        if(febHours[n] >= 70) highWarning = true;

          // calculate totalPay
        const overTimeHours = currWeekHours > 40 ? currWeekHours - 40 : 0;
        const regPay = overTimeHours > 0 ? 40 * 22 : currWeekHours * 22;
        const otPay = overTimeHours * 33;
        const totalPay = regPay + otPay;
        i++

        febWeeks.push(<div key={`feb-${i}`}className={`${week}`}>
                        <ul className="date-list">
                            {feb[`${week}`]}
                            <div className="summary">
                                <p className="total-hours">Total Hours For Week: {febHours[n].toFixed(2)}</p>
                                <p>Regular Pay: {regPay.toFixed(2)}</p>
                                <p>Overtime Pay: {otPay.toFixed(2)}</p>
                                <p>Weekly Pay: {totalPay.toFixed(2)} </p>
                                {mediumWarning && <p className="med-warning">Warning driver within 80% of 70 hours worked this week</p>}
                                {highWarning && <p className="high-warning">Warning driver exceeded 70 hours worked this week</p>}
                            </div>
                        </ul>
                     </div>)
    };

    const marchWeeks = [];
    for(let week in march) {
        // set warning flags to false
        let mediumWarning = false;
        let highWarning = false;

        // if weeks hours exceed 80% trigger warning, over 100% trigger higher warning
        const n = week.slice(week.length - 1);
        const currWeekHours = marchHours[n];

        if(marchHours[n] >= 56 && marchHours[n] < 70) mediumWarning = true;
        if(marchHours[n] >= 70) highWarning = true;

        // calculate totalPay
        const overTimeHours = currWeekHours > 40 ? currWeekHours - 40 : 0;
        const regPay = overTimeHours > 0 ? 40 * 22 : currWeekHours * 22;
        const otPay = overTimeHours * 33;
        const totalPay = regPay + otPay;
        i++

        marchWeeks.push(<div key={`march-${i}`}className={`${week}`}>
                        <ul className="date-list">
                            {march[`${week}`]}
                            <div className="summary">
                                <p className="total-hours">Total Hours For Week: {marchHours[n].toFixed(2)}</p>
                                <p>Regular Pay: {regPay.toFixed(2)}</p>
                                <p>Overtime Pay: {otPay.toFixed(2)}</p>
                                <p>Weekly Pay: {totalPay.toFixed(2)} </p>
                                {mediumWarning && <p className="med-warning">Warning driver within 80% of 70 hours worked this week</p>}
                                {highWarning && <p className="high-warning">Warning driver exceeded 70 hours worked this week</p>}
                            </div>
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