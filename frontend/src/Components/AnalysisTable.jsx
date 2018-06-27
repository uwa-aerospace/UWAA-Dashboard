import React, {Component} from  'react';
import {Table} from 'antd';

const data = [{
    key: '1',
    name: 'Altitude',
    min: 0,
    max: 0,
    avg: 0,
    status_min: 'RK_READY',
    status_max: 'RK_APOGEE',
    tal_min: '0',
    tal_max: '20',
    units: 'm',
},{
    key: '2',
    name: 'Acceleration',
    min: 0,
    max: 4,
    avg: 0,
    status_min: 'RK_READY',
    status_max: 'RK_LAUNCH',
    tal_min: '0',
    tal_max: '5',
    units: 'm/s.s',
},{
    key: '3',
    name: 'Velocity',
    min: -15,
    max: 600,
    avg: 0,
    status_min: 'RK_DROUGE',
    status_max: 'RK_COAST',
    tal_min: '30',
    tal_max: '10',
    units: 'm/s',
}];

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
        return (
            <Table columns={min_max_columns} dataSource={data} bordered={true} pagination={false}></Table>
        );
    }
}

export default AnalysisTable;