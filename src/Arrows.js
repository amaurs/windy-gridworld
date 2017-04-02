import React from 'react';
import { Marker, SquareD3, Arrow} from './util';


class Arrows extends React.Component {
    constructor(props) {
        super(props);
        console.log(props.arrows);
    }

    coordToInt(x, y) {
        return x + this.props.width * y ;
    }

    render() {
        let squares = [];
        for(let y = 0; y < this.props.height; y++) {
            for(let x = 0; x < this.props.width; x++) {
                squares.push(<SquareD3 x={x * (+this.props.size + 1)} y={y * (+this.props.size + 1)} size={this.props.size} show={this.props.arrows[this.coordToInt(x, y)]} key={this.coordToInt(x, y)}/>);
            }
        }
        return  <svg width="250" height="250">
                    <g>
                        <defs><Marker name="arrow"/></defs>
                    </g>
                    {squares}
                </svg>;
    }
}
export default Arrows;