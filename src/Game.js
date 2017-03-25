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
    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(), 
            100
        );
    }
    tick() {
        let stepRes = this.state.agent.tick();
        if(stepRes.isDone) {
            this.state.agent.initEpisode();
            this.setState({episodes: this.state.episodes + 1});
        }
        this.setState({board: this.state.agent.toBoard()});
    }
    componentWillUnmount() {
        clearInterval(this.timerID);
    }
    render() {
        return  <div>
                    <Board board={this.state.agent.toBoard()}/>
                </div>
    }
}

export default Game;