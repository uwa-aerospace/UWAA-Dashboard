import React, {Component} from 'react';
import {CSVLink} from 'react-csv';
import {Row, Button } from 'antd';
import AnalysisTable from './AnalysisTable';
import AltitudeChart from './AltitudeChart';


class AnalysisPanel extends Component {

    render() {
        return (
            <Row>
                <Row>
                    <AltitudeChart altitude_data={this.props.data}/>
                </Row>
                <Row>
                    <AnalysisTable data={this.props.min_max}/>
                </Row>
                <Row>
                    <Button><CSVLink data={this.props.data} />Export</Button>
                </Row>
            </Row>
        );
    }
}

export default AnalysisPanel;