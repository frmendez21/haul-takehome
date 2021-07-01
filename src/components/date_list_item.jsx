import React, {useState} from 'react';

const DateListItem = props => {
    // set dropdown hook to false and create toggle function to handle click
    const [dropDown, showDropDown] = useState(false);
    const toggleDropDown = () => showDropDown(!dropDown);

    // get local dates and times
    const startDate = props.startTime.toLocaleDateString();
    const endDate = props.endTime.toLocaleDateString();
    const startTime = props.startTime.toLocaleTimeString();
    const endTime = props.endTime.toLocaleTimeString();

    // if dropdown has not been toggled don't show dropdown, else show
    if(!dropDown) {
        return(
            <li className="date-list-item" onClick={toggleDropDown}>
                {startDate}
            </li>
        );
    } else {
        // console.log(dailyPay)
        return(
            <li className="date-list-item" onClick={toggleDropDown}>
                {startDate}
                <p>Start Time: {startTime}</p>
                <p>End Date: {endDate} </p>
                <p>End Time: {endTime}</p>
                <p>Hours Worked: {props.hours.toFixed(2)}</p>
                <p>Daily Pay: {props.dailyPay.toFixed(2)}</p>
            </li>
        );
    };
};

export default DateListItem;