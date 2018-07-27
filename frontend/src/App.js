import React, { Component } from 'react';
import { Layout, Menu, Icon, notification } from 'antd';
import ControlPanel from './Components/ControlPanel';
import AnalysisPanel from './Components/AnalysisPanel';
import SavePanel from './Components/SavePanel';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
const { Content, Sider } = Layout;

class App extends Component {
  state = {
    collapsed: false,
		content_selected: 1,
		
		min_max: {
			altitude: {
				key: 1,
				name: 'Altitude',
				min: 0,
				max: 0,
				avg: 0,
				status_min: 'RK_ON',
				status_max: 'RK_ON',
				tal_min: '0',
				tal_max: '0',
				units: 'm',
			},
			acceleration: {
					key: '2',
					name: 'Acceleration',
					min: 9.18,
					max: 9.18,
					avg: 0,
					status_min: 'RK_ON',
					status_max: 'RK_ON',
					tal_min: '0',
					tal_max: '0',
					units: 'm/s.s',
			},
			velocity: {
					key: '3',
					name: 'Velocity',
					min: 0,
					max: 0,
					avg: 0,
					status_min: 'RK_ON',
					status_max: 'RK_ON',
					tal_min: '0',
					tal_max: '0',
					units: 'm/s',
			}
		},

		progress_error: false,
		curr_flight_sequence_id: 0,
		altitude_data: [],
		current_acceleration: 0,
		current_velocity: 0,
		current_pressure: 0,
		current_temp: 0,
		current_altitude: 0,
		latitude: -31.0,
		longitude: 115.0,
		log: [],
		flight_computer_status: 'Startup',
		flight_status_text: 'Flight Computer Has Started Up',
		flight_computer_sequence: 'Startup',
		flight_sequence_text: 'Flight Computer Has Started Up',
  };

  componentDidMount() {
		this.interval = setInterval(() => this.fetchData(), 400);
		console.log();
	}
	componentWillUnmount() {
    clearInterval(this.interval);
  }

  getProgressID(api_id) {
		if (api_id >= 0 && api_id <= 2)			return 0;
		else if (api_id === 3) 					return 1;
		else if (api_id === 4) 					return 2;
		else if (api_id === 6) 					return 3;
		else if (api_id === 7) 					return 4;
		else if (api_id === 8) 					return 5;
		else if (api_id === 9) 					return 6;
		else if (api_id === 10 || api_id === 11) 	return 7;
		else if (api_id === 12 || api_id === 13) 	return 8;
		else if (api_id === 14) 					return 9;

		if (api_id === 5 || api_id === 99) 		return -1;
	}

	openNotification = (type, title, description) => {
		notification[type]({
		  message: title,
		  description: description,
		  placement: 'bottomRight',
		  duration: 5,
		});
	};

  fetchData() {
		(async () => {
			const rawResponse = await fetch('http://localhost:5000/', {
				method: 'GET',
			});
			const content = await rawResponse.json();
			
			var seq_id = this.state.curr_flight_sequence_id;
			var stat = this.state.flight_computer_status;
			var seq = this.state.flight_computer_sequence;
			var altitude = this.state.current_altitude;
			var acceleration = this.state.current_acceleration;
			var velocity = this.state.current_velocity;
			var pressure = this.state.current_pressure;
			var temperature = this.state.current_temp;
			var latitude = this.state.latitude;
			var longitude = this.state.longitude;
			var log = this.state.log.slice();

			var progress_error = this.state.progress_error;
			var arr = this.state.altitude_data.slice();

			var new_min_max = this.state.min_max;
			for (var key in content) {
				arr.push({time: parseInt(key)/1000, alti: parseInt(content[key]['altitude'])});
				log.push(content[key]);
				seq = content[key]['sequence']
				stat = content[key]['status']
				altitude = parseFloat(content[key]['altitude']).toFixed(2);
				acceleration = parseFloat(content[key]['acceleration']*9.82).toFixed(3);
				velocity = parseFloat(content[key]['velocity']).toFixed(3);
				pressure = (parseFloat(content[key]['pressure'])).toFixed(2);
				temperature = parseFloat(content[key]['temperature']).toFixed(2);
				latitude = parseFloat(content[key]['latitude']);
				longitude = parseFloat(content[key]['longitude']);

				if (altitude > this.state.min_max.altitude.max) {
					new_min_max.altitude.max = altitude;
					new_min_max.altitude.tal_max = parseInt(key)/1000;
				} else if (altitude < this.state.min_max.altitude.min) {	
					new_min_max.altitude.min = altitude;
					new_min_max.altitude.tal_min = parseInt(key)/1000;
				}
				if (acceleration > this.state.min_max.acceleration.max) {
					new_min_max.acceleration.max = acceleration;
					new_min_max.acceleration.tal_max = parseInt(key)/1000;
				} else if (acceleration < this.state.min_max.acceleration.min) {	
					new_min_max.acceleration.min = acceleration;
					new_min_max.acceleration.tal_min = parseInt(key)/1000;
				}
				if (velocity > this.state.min_max.velocity.max) {
					new_min_max.velocity.max = velocity;
					new_min_max.velocity.tal_max = parseInt(key)/1000;
				} else if (velocity < this.state.min_max.velocity.min) {	
					new_min_max.velocity.min = velocity;
					new_min_max.velocity.tal_min = parseInt(key)/1000;
				}

				if (parseInt(this.getProgressID(content[key]['status_id'])) !== -1) {
					seq_id = parseInt(this.getProgressID(content[key]['status_id']));
					progress_error = false;
				} else {
					progress_error = true;
				}
			}
			if (seq_id !== this.state.curr_flight_sequence_id && content[key] !== undefined && content[key]['status'] !== undefined) {
				var notify_type = progress_error ? 'error' : 'success';
				this.openNotification(notify_type, 'Status -> ' + content[key]['status'], '');
			}
			
			this.setState({altitude_data: arr, curr_flight_sequence_id: seq_id, flight_computer_sequence: seq, light_computer_status: stat, progress_error: progress_error,
				 current_altitude: altitude, current_acceleration: acceleration, current_velocity: velocity, current_pressure: pressure, current_temp: temperature,
					min_max: new_min_max, latitude: latitude, longitude: longitude, log: log });
		})();
	}

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  }
  handleContentChange = (item, key, selectedKeys) => {
    this.setState({content_selected: item.key});
  }
  render() {
		const log = this.state.log;
    return (
			<Router>
				<Layout style={{ minHeight: '100vh'}}>
					<Sider collapsible={true} collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
					<div className="logo" />
						<Menu theme="dark" mode="vertical" defaultSelectedKeys={['1']} onClick={this.handleContentChange}>
							<Menu.Item key="1">
								<Link to="/">
									<Icon type="dashboard" />
									<span>Control Panel</span>
								</Link>
							</Menu.Item>
							<Menu.Item key="2">
								<Link to="/analysis">
									<Icon type="dot-chart" />
									<span>Analysis</span>
								</Link>
							</Menu.Item>
							<Menu.Item key="3">
								<Link to="/save-data">
									<Icon type="save" />
									<span>Save</span>
								</Link>
							</Menu.Item>
						</Menu>
					</Sider>
					<Layout>
						<Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
							<Route exact path="/" render={()=><ControlPanel data={this.state}/>} />
							<Route exact path="/analysis" render={()=><AnalysisPanel data={this.state.altitude_data} min_max={this.state.min_max} />} />
							<Route exact path="/save-data" render={()=><SavePanel data={log} min_max={this.state.min_max} />} />
						</Content>
					</Layout>
				</Layout>
			</Router>
    );
  }
}

export default App;
