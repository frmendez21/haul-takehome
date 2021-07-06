import React, {useEffect} from 'react';
import DriverIndexLogic from './driver_index_logic';

const DriverIndex = () => {
    
    // create async function to fetch data from file
    const {driverData, organizeDataCB} = DriverIndexLogic()

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
                // iterate over json result and push json result[i].data (deconstructed) to new array
                // use callback in driver logic to organize data
                let datum = [];
                json.forEach(dat => datum.push(...dat.data))
                organizeDataCB(datum)
            })
    }, [organizeDataCB]);

    if(!driverData) return null;
   
    return (
        <div className="driver-index">
            <div className="month-container">
                <h5 className="month-head">January</h5>
                    {driverData.janWeeks}
            </div>
            <div className="month-container">
                <h5 className="month-head">February</h5>
                    {driverData.febWeeks}
            </div>
            <div className="month-container">
                <h5 className="month-head">March</h5>
                    {driverData.marchWeeks}
            </div>
        </div>
    );
};

export default DriverIndex;