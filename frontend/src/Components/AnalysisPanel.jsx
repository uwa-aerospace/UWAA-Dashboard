import React, {Component} from 'react';
import {Row} from 'antd';
import AnalysisTable from './AnalysisTable';
import AltitudeChart from './AltitudeChart';


class AnalysisPanel extends Component {
    state = {
        table_data: [],
    };

    render() {
        return (
            <Row>
                <Row>
                    <AltitudeChart />
                </Row>
                <Row>
                    <AnalysisTable />
                </Row>
            </Row>
        );
    }
}

export default AnalysisPanel;