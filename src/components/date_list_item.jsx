import React, {useState} from 'react';

const DateListItem = props => {
    const [dropDown, showDropDown] = useState(false);
    const toggleDropDown = () => showDropDown(!dropDown);

    const startDate = new Date(props.datum.startTime).toLocaleDateString();
    const endDate = new Date(props.datum.endTime).toLocaleDateString();
    const startTime = new Date(props.datum.startTime).toLocaleTimeString();
    const endTime = new Date(props.datum.endTime).toLocaleTimeString()
    const milliDiff = new Date(props.datum.endTime) - new Date(props.datum.startTime);
    const hoursWorked = Math.floor(milliDiff / 3600000)

    if(!dropDown) {
        return(
            <li className="date-list-item" onClick={toggleDropDown}>
                {startDate}
            </li>
        );
    } else {

        return(
            <li className="date-list-item" onClick={toggleDropDown}>
                {startDate}
                <p>Start Time: {startTime}</p>
                <p>End Date: {endDate} </p>
                <p>End Time: {endTime}</p>
                <p>Hours Worked: {hoursWorked}</p>
            </li>
        );
    };
};

export default DateListItem;