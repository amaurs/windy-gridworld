import React from 'react';
import {Row} from './util.js';

class Board extends React.Component {
  render() {
        const items = this.props.board.map((row, index) => 

                <Row key={index} row={row} />
            );

        return <div className="grid_bg">{items}</div>;
  }
}
export default Board;