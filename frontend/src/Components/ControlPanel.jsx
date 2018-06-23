import React, {Component} from 'react';
import {Row, Col} from 'antd';
import {Steps, Form, Button, Icon, Input, Card} from 'antd';
import {Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Label, ReferenceLine} from 'recharts';
const Step = Steps.Step;
const FormItem = Form.Item;
const Search = Input.Search;

class ControlPanel extends Component{
	state = {
		data: [],
		command_string: '',
		flight_computer_status: 'RK_STARTUP',
		flight_status_text: 'Flight Computer Has Started Up',
		flight_computer_sequence: 'RK_STARTUP',
		flight_sequence_text: 'Flight Computer Has Started Up',
	}
	componentDidMount() {
		this.interval = setInterval(() => this.fetchData(), 2000);
	}
	componentWillUnmount() {
		clearInterval(this.interval);
	}

	handleChange(value) {
		this.setState({command_string: value.target.value});
	}

	fetchData() {
		(async () => {
			const rawResponse = await fetch('http://localhost:5000/', {
				method: 'GET',
			});
			const content = await rawResponse.json();
			var arr = [];
			for (var key in content) {
				arr.push(content[key]);
			}
			this.setState({data: arr});
		})();
	}

	handleSend(value) {
		(async () => {
			const rawResponse = await fetch('http://localhost:5000/send-command/', {
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify({command: value})
			});
			const content = await rawResponse.json();
			console.log(content)
		})();
		this.setState({command_string: ''});
	}

	render() {
		const data = this.state.data;
		console.log(data);
		const status_card_title = 'Status - ' + this.state.flight_computer_status;
		const sequence_card_title = 'Sequence - ' + this.state.flight_computer_sequence;
		return (
			<div className="control-panel" style={{height: '100%'}}>
				<Row style={{ marginBottom: 16 }}>
					<Steps current={6} progressDot={true}>
						<Step title="Start Up"/>
						<Step title="Diagnostics Start"/>
						<Step title="Diagnostics Finish"/>
						<Step title="Ready"/>
						<Step title="Launch"/>
						<Step title="Coast" />
						<Step title="Apogee" />
						<Step title="Deploy Drouge"/>
						<Step title="Deploy Mains"/>
						<Step title="Landed"/>
					</Steps>
				</Row>
				<Row style={{ height: '100%'}}>
					<Col span={8} style={{paddingRight: '1.5vw', borderRightWidth: '1px', borderRightColor: '#eee', borderRightStyle:'solid'}}>
						<Row style={{ marginBottom: 8 }}>
							<Col>
								<Row justify='center' style={{ marginBottom: 8 }}>
									<Card hoverable={true} title={sequence_card_title} extra={<Icon type="check-circle" style={{color:'green'}}/>}>
										{this.state.flight_sequence_text}
									</Card>
								</Row>
								<Row justify='center' style={{ marginBottom: 8 }}>
									<Card hoverable={true} title={status_card_title} extra={<Icon type="check-circle" style={{color:'green'}}/>}>
										{this.state.flight_status_text}
									</Card>
								</Row>
							</Col>
						</Row>
						<Row>
							<Form>
								<FormItem>
									<Search prefix={<Icon type="code-o"/>} type="text" placeholder="Enter Command" enterButton="Send" size="large" 
									onSearch={value => this.handleSend(value)} onChange={value => this.handleChange(value)} value={this.state.command_string}/>
								</FormItem>
							</Form>
						</Row>
					</Col>
					<Col span={16}>
						<LineChart width={900} height={400} data={data} margin={{top: 5, right: 5, bottom: 15, left: 15}}>
							<Line type="monotone" dataKey="alti" stroke="#8884d8" />
  							<ReferenceLine y={30} label="Target Height" isFront={true} alwaysShow={true} stroke="#82ca9d" />
							<CartesianGrid strokeDasharray="3 3"/>
							<Tooltip/>
							<XAxis dataKey="time" unit="s"><Label value="Time Since Launch (s)" position="bottom" offset={0}/></XAxis>
							<YAxis label={{value: "Height", angle: -90, position: 'left', offset: 0}} unit="m"/>
						</LineChart>
					</Col>
				</Row>
			</div>
		);
	}

}

export default ControlPanel;