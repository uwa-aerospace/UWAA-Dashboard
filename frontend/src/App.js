import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import ControlPanel from './Components/ControlPanel';
import './App.css';
const { Content, Sider } = Layout;

const content = [<ControlPanel/>, 'world', 'hi'];

class App extends Component {
  state = {
    collapsed: false,
    content_selected: 1,
  };
  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  }
  handleContentChange = (item, key, selectedKeys) => {
    console.log(item.key);
    this.setState({content_selected: item.key});
  }
  render() {
    const content_fill = content[this.state.content_selected-1];
    console.log(content_fill);
    return (
      <Layout style={{ minHeight: '100vh'}}>
          <Sider collapsible={true} collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />
            <Menu theme="dark" mode="vertical" defaultSelectedKeys={['1']} onClick={this.handleContentChange}>
              <Menu.Item key="1">
                <Icon type="appstore" />
                <span>Control Panel</span>
              </Menu.Item>
              <Menu.Item key="2">
                <Icon type="dot-chart" />
                <span>Analysis</span>
              </Menu.Item>
              <Menu.Item key="3">
                <Icon type="save" />
                <span>Save</span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            {content_fill}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default App;
