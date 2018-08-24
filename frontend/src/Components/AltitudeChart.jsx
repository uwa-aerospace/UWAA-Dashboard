import React, {Component} from 'react';
import {Line, LineChart, XAxis, YAxis, CartesianGrid, Label, ReferenceLine, ResponsiveContainer} from 'recharts';

class AltitudeChart extends Component {
    
    render() {
        return (
            <ResponsiveContainer width='100%' height={400}>
                <LineChart data={this.props.altitude_data} tool margin={{top: 5, right: 5, bottom: 15, left: 15}} title="Altitude">
                    <Line type="monotone" isAnimationActive={false} dataKey="alti" stroke="black" dot={false}/>
                    <ReferenceLine y={1300} label="Target Height" isFront={true} stroke="red" />
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="time" unit="s" tickCount={2} interval={'preserveEnd'} allowDecimals={false}><Label value="Time Since Launch Sequence Began (s)" position="bottom" offset={0}/></XAxis>
                    <YAxis label={{value: "Height", angle: -90, position: 'left', offset: 0}} unit="m"/>
                </LineChart>
            </ResponsiveContainer>
        );
    }
}

export default AltitudeChart;