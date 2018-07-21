import React, { Component } from 'react';
import { Divider, Form, Icon, Input, List } from 'antd';

const FormItem = Form.Item;
const Search = Input.Search;

class Communications extends Component {
    state = {
        messageLog: [],
        messageLogLimit: 5,
        command_string: '',
    }
    
    handleChange(value) {
		this.setState({command_string: value.target.value});
	}
	
	handleSend(value) {
        const messages = this.state.messageLog;
        if (messages.length === this.state.messageLogLimit) {
            messages.splice(0, 1);
        }
        messages.push(value);
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
		this.setState({command_string: '', messageLog: messages});
	}

    render() {
        const messages = this.state.messageLog;
        const hasMessages = messages.length > 0;
        return(
            <div>
                <Form>
                    <FormItem>
                        <Search prefix={<Icon type="code-o"/>} type="text" placeholder="Enter Command" enterButton="Send" size="large" 
                        onSearch={value => this.handleSend(value)} onChange={value => this.handleChange(value)} value={this.state.command_string}/>
                    </FormItem>
                </Form>
                <Divider/>
                <List bordered={true} header={<h4>Message Log</h4>}>
                {messages.map((element, index) => (
                    <List.Item>
                        <List.Item.Meta title={element} />
                    </List.Item>
                ))}
                </List>
            </div>
        );
    }
}

export default Communications;