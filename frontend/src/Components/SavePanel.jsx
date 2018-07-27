import React, {Component} from 'react';
import { CSVLink } from 'react-csv';
import { Button } from 'antd';

const data_headers = [
    {label: 'Time', key:'time'},
    {label: 'Sequence', key:'sequence'},
    {label: 'Status', key:'status'},
    {label: 'Altitude', key:'altitude'},
    {label: 'Acceleration', key:'acceleration'},
    {label: 'Velocity', key:'velocity'},
    {label: 'Pressure', key:'pressure'},
    {label: 'Temperature', key:'temperature'},
    {label: 'Longitude', key:'longitude'},
    {label: 'Latitude', key:'latitude'},
];

class SavePanel extends Component {
    render() {
        console.log(this.props.data);
        const data = this.props.data;
        return (
            <CSVLink headers={data_headers} filename={"FlightData.csv"} data={data} separator={";"} target="_blank">Download Me</CSVLink>
        );
    }
}

export default SavePanel;