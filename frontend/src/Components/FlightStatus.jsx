import React, {Component} from 'react';
import {Card, List, Avatar, Icon} from 'antd';

class FlightStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flight_status: {
                status: '',
                altitude: 0,
                acceleration: 0,
                velocity: 0,
                pressure: 0,
                temperature: 0,
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ flight_status: nextProps.flight_status });
    }
    
    render () {
        console.log(this.state.flight_status.latitude)
        const good = 'green';
        const bad = 'red';
        let altitude_stat = good;
        if (this.state.flight_status.altitude < 0.0) altitude_stat = bad;
        let accel_stat = good;
        if (this.state.flight_status.acceleration <= -(14.0*9.82) || this.state.flight_status.acceleration >= (14.0*9.82)) accel_stat = bad;
        let velo_stat = good;
        if (this.state.flight_status.velocity < -320.0 || this.state.flight_status.velocity > 320.0) velo_stat = bad;
        let temp_stat = good;
        if (this.state.flight_status.temperature < 0.0 || this.state.flight_status.temperature > 60.0) temp_stat=bad;
        return (
            <Card hoverable={true} title={this.state.flight_status.status} extra={<Icon type="check-circle" style={{color:'green'}}/>}>
                <List>
                    <List.Item>
                        <List.Item.Meta avatar={<Avatar icon={"area-chart"} style={{ backgroundColor: altitude_stat }}/>}  title="Altitude"/>
                        <span>{this.state.flight_status.altitude} m</span>
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta avatar={<Avatar icon="rocket" style={{ backgroundColor: accel_stat }}/>} title="Acceleration"/>
                        {this.state.flight_status.acceleration} m/s<sup>2</sup>
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta avatar={<Avatar icon="line-chart" style={{ backgroundColor: velo_stat }}/>} title="Velocity"/>
                        {this.state.flight_status.velocity} m/s
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta avatar={<Avatar icon="dashboard" style={{ backgroundColor: 'black' }}/>} title="Pressure"/>
                        {this.state.flight_status.pressure} kPa
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta avatar={<Avatar icon="exclamation" style={{ backgroundColor: temp_stat }}/>} title="Temperature"/>
                        {this.state.flight_status.temperature} C
                    </List.Item>
                    <List.Item>
                        <List.Item.Meta avatar={<Avatar icon="compass" style={{ backgroundColor: 'black' }}/>} title="Position"/>
                        <span style={{float:'right'}}>Lat: {this.state.flight_status.latitude}</span> <span>Lon: {this.state.flight_status.longitude}</span>
                    </List.Item>
                </List>
            </Card>
        );
    }
}

export default FlightStatus;