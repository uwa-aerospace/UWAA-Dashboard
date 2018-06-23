import React, {Component} from 'react';
import {Line, LineChart, XAxis, YAxis, CartesianGrid, Label, ReferenceLine} from 'recharts';

class AltitudeChart extends Component {
    constructor(props) {
        super(props);
            this.state = {
                data: [],
        }
    }
    componentDidMount() {
		//this.interval = setInterval(() => this.fetchData(), 200);
	}
	componentWillUnmount() {
		//clearInterval(this.interval);
    }

    fetchData() {
		if (this.state.flight_computer_status == "Launched") {
			(async () => {
				const rawResponse = await fetch('http://localhost:5000/', {
					method: 'GET',
				});
				const content = await rawResponse.json();
				var arr = this.state.altitude_data.slice();
				for (var key in content) {
					arr.push({time: parseInt(key)/1000, alti: parseInt(content[key]['alti'])});
				}
				this.setState({altitude_data: arr});
			})();
		}
	}
    
    render() {
        return (
            <LineChart width={900}  height={400} data={this.state.altitude_data} margin={{top: 5, right: 5, bottom: 15, left: 15}}>
                <Line type="monotone" isAnimationActive={false} dataKey="alti" stroke="#8884d8" />
                <ReferenceLine y={30} label="Target Height" isFront={true} stroke="#82ca9d" />
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="time" unit="s"><Label value="Time Since Launch (s)" position="bottom" offset={0}/></XAxis>
                <YAxis label={{value: "Height", angle: -90, position: 'left', offset: 0}} unit="m"/>
            </LineChart>
        );
    }
}

export default AltitudeChart;