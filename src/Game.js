import React from 'react';
import Board from './Board.js';

class Game extends React.Component{
    constructor(props) {
        super(props);
        console.log(this.props.environment.toBoard());
        this.state = {
            board : this.props.environment.toBoard(),
        }

    }

    render() {
        return  <div>
                    <Board board={this.state.board}/>
                </div>
    }
}

export default Game;