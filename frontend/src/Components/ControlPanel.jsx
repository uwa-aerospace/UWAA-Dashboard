import React, {Component} from 'react';
import {Row, Col} from 'antd';
import {Steps, Form, Button, Icon, Input, Card, notification} from 'antd';
import AltitudeChart from './AltitudeChart';
const Step = Steps.Step;
const FormItem = Form.Item;
const Search = Input.Search;

class ControlPanel extends Component{
	state = {
		command_string: '',
		progress_error: false,
		curr_flight_sequence_id: 0,
		altitude_data: [],
		flight_computer_status: 'Startup',
		flight_status_text: 'Flight Computer Has Started Up',
		flight_computer_sequence: 'Startup',
		flight_sequence_text: 'Flight Computer Has Started Up',
	}

	componentDidMount() {
		this.interval = setInterval(() => this.fetchData(), 200);
	}
	componentWillUnmount() {
		clearInterval(this.interval);
    }

	handleChange(value) {
		this.setState({command_string: value.target.value});
	}

	openNotification = (type, title, description) => {
		notification[type]({
		  message: title,
		  description: description,
		  placement: 'bottomRight',
		  duration: 5,
		});
	  };

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
	
	fetchData() {
		(async () => {
			const rawResponse = await fetch('http://localhost:5000/', {
				method: 'GET',
			});
			const content = await rawResponse.json();
			var seq_id = this.state.curr_flight_sequence_id;
			var stat = this.state.flight_computer_status;
			var seq = this.state.flight_computer_sequence
			var progress_error = this.state.progress_error;
			var arr = this.state.altitude_data.slice();
			for (var key in content) {
				arr.push({time: parseInt(key)/1000, alti: parseInt(content[key]['alti'])});
				seq = content[key]['sequence']
				stat = content[key]['status']
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
			this.setState({altitude_data: arr, curr_flight_sequence_id: seq_id, flight_computer_sequence: seq, flight_computer_status: stat, progress_error: progress_error});
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
		const data = this.state.altitude_data;
		const flight_status_card_title = this.state.flight_computer_sequence+' - '+this.state.flight_computer_status;
		const progress_status = this.state.progress_error ? 'error' : 'process';
		return (
			<div className="control-panel" style={{height: '100%'}}>
				<Row style={{ marginBottom: 16 }}>
					<Col span={6} style={{paddingRight: '1.5vw', borderRightWidth: '1px', borderRightColor: '#eee', borderRightStyle:'solid'}}>
						<Steps current={this.state.curr_flight_sequence_id} size={'small'} direction={'vertical'} status={progress_status}>
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
					</Col>
					<Col span={18}>
						<AltitudeChart altitude_data={data}/>
					</Col>
				</Row>
				<Row style={{ height: '100%'}}>
					<Col span={6} style={{paddingRight: '1.5vw', borderRightWidth: '1px', borderRightColor: '#eee', borderRightStyle:'solid'}}>
						<Row style={{ marginBottom: 8 }}>
							<Col>
								<Row justify='center' style={{ marginBottom: 8 }}>
									<Card hoverable={true} title={flight_status_card_title} extra={<Icon type="check-circle" style={{color:'green'}}/>} />
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
					
				</Row>
			</div>
		);
	}

}

export default ControlPanel;