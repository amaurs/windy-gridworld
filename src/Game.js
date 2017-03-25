import React from 'react';
import Board from './Board.js';
import Agent from './agent.js';

class Game extends React.Component{
    constructor(props) {
        super(props);
        const agent = new Agent(this.props.environment);
        this.state = {
            agent : agent,
            board : agent.toBoard(),
        }

    }

    render() {
        return  <div>
                    <Board board={this.state.agent.toBoard()}/>
                </div>
    }
}

export default Game;