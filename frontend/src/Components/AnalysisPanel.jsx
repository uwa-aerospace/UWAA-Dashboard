import React, {Component} from 'react';
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
            </Row>
        );
    }
}

export default AnalysisPanel;