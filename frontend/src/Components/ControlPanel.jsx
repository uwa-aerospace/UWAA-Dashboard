import React, {Component} from 'react';
import {Row, Col, Divider} from 'antd';
import {Steps, Form, Icon, Input, List} from 'antd';
import AltitudeChart from './AltitudeChart';
import FlightStatus from './FlightStatus';
import Communications from './Communications';
const Step = Steps.Step;
const FormItem = Form.Item;
const Search = Input.Search;

class ControlPanel extends Component{

	render() {
		const data = this.props.data.altitude_data;
		const flight_status = {
			status: this.props.data.flight_computer_sequence+' - '+this.props.data.flight_computer_status,
			altitude: this.props.data.current_altitude,
			acceleration: this.props.data.current_acceleration,
			velocity: this.props.data.current_velocity,
			pressure: this.props.data.current_pressure,
			temperature: this.props.data.current_temp,
			latitude: this.props.data.latitude,
			longitude: this.props.data.longitude,}
			
		const progress_status = this.props.data.progress_error ? 'error' : 'process';
		return (
			<div className="control-panel" style={{height: '100%'}}>
				<Row style={{ marginBottom: 16 }}>
					<Col span={6} style={{paddingRight: '1.5vw', borderRightWidth: '1px', borderRightColor: '#eee', borderRightStyle:'solid'}}>
						<Steps current={this.props.data.curr_flight_sequence_id} size={'small'} direction={'vertical'} status={progress_status}>
							<Step title="Start Up"/>
							<Step title="Diagnostics Start"/>
							<Step title="Diagnostics Finish"/>
							<Step title="Ready"/>
							<Step title="Launch"/>
							<Step title="Coast" />
							<Step title="Apogee" />
							<Step title="Deploy Drouge"/>
							<Step title="Deploy Mains"/>
							<Step title="Landing"/>
							<Step title="Landed"/>
						</Steps>
						<Communications />
					</Col>
					<Col span={18}>
						<Row>
							<AltitudeChart altitude_data={data}/>
						</Row>
						<Row>
							<Col span={8} push={1}>
								<FlightStatus flight_status={flight_status}/>
							</Col>
							<Col span={9} push={1}>
									This is where the GPS graph should go
							</Col>
						</Row>
					</Col>
				</Row>
			</div>
		);
	}

}

export default ControlPanel;