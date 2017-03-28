import React from 'react';
import { VictoryLine } from 'victory';

const data = [
  {quarter: 1, earnings: 13000},
  {quarter: 2, earnings: 16500},
  {quarter: 3, earnings: 14250},
  {quarter: 4, earnings: 19000}
];

class Chart extends React.Component {
    constructor(props) {
        super(props);
    }

  render() {
      return <VictoryLine
        data={data}
        // data accessor for x values
        x="quarter"
        // data accessor for y values
        y="earnings"
      />
  }
}
export default Chart;