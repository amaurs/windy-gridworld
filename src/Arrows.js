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
                squares.push(<SquareD3 x={x * (+this.props.size)} 
                                       y={y * (+this.props.size)} 
                                       className={(this.props.agent.x===x && this.props.agent.y===y)?"agent":"empty"}
                                       size={this.props.size} 
                                       show={this.props.arrows[this.coordToInt(x, y)]} 
                                       key={this.coordToInt(x, y)}/>);
            }
        }
        return  <svg className="arrows" width={+this.props.width * (+this.props.size)} height={+this.props.height * (+this.props.size)}>
                    <g>
                        <defs><Marker name="arrow"/></defs>
                    </g>
                    {squares}
                </svg>;
    }
}
export default Arrows;