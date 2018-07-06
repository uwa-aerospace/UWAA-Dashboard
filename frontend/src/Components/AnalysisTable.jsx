import React, {Component} from  'react';
import {Table} from 'antd';

const min_max_columns = [{
    title: 'Name',
    dataIndex: 'name',
    align: 'left',
},{
    title: 'Minimum',
    children: [{
        title: 'TAL',
        dataIndex: 'tal_min',
        align: 'center',
        render: (text, record) => (
            <span>{text + 's'}</span>
        ),
    },{
        title: 'Min Status',
        align: 'center',
        dataIndex: 'status_min',
    },{
        title: 'Value',
        dataIndex: 'min',
        sorter: (a, b) => a.min - b.min,
        render: (text, record) => (
            <span>{text + ' ' + record.units}</span>
        ),
    }],
},{
    title: 'Maximum',
    children: [{
        title: 'TAL',
        dataIndex: 'tal_max',
        align: 'center',
        render: (text, record) => (
            <span>{text + 's'}</span>
        ),
    },{
        title: 'Max Status',
        dataIndex: 'status_max',
        align: 'center',
    },{
        title: 'Value',
        dataIndex: 'max',
        align: 'center',
        sorter: (a, b) => a.max - b.max,
        render: (text, record) => (
            <span>{text + ' ' + record.units}</span>
        ),
    }],
},{
    title: 'Average Value',
    dataIndex: 'avg',
    sorter: (a, b) => a.avg - b.avg,
    render: (text, record) => (
        <span>{text + ' ' + record.units}</span>
    ),
    align: 'center',
}];

class AnalysisTable extends Component {


    render() {
        
        var data = [];
        data.push(this.props.data.altitude);
        data.push(this.props.data.acceleration);
        data.push(this.props.data.velocity);

        return (
            <Table columns={min_max_columns} dataSource={data} bordered={true} pagination={false}></Table>
        );
    }
}

export default AnalysisTable;