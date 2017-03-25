import React from 'react';
import Board from './Board.js';
import { Agent } from './sarsaAgent.js';

class Game extends React.Component{
    constructor(props) {
        super(props);
        const epsilon = .1;
        const alpha = 0.8;
        const gamma = 0.4;
        const agent = new Agent(this.props.environment);
        this.state = {
            started : false,
            agent : agent,
            board : agent.toBoard(),
            epsilon : epsilon,
            gamma : gamma,
            alpha : alpha,
            wins : 0,
            crashes : 0,
            episodes : 0, 
        }
        this.handleEpsilonChange = this.handleEpsilonChange.bind(this);
        this.handleAlphaChange = this.handleAlphaChange.bind(this);
        this.handleGammaChange = this.handleGammaChange.bind(this);

    }
    init(){
        const epsilon = .1;
        const agent = new Agent(this.props.environment, this.state.epsilon);

        this.setState({
            board : agent.toBoard(),
            started : false,
            agent : agent,
            epsilon : epsilon,
            wins : 0,
            crashes : 0,
            episodes : 0,})
    }
    componentDidMount() {

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
    start() {
        this.setState({started: true})
        this.timerID = setInterval(
            () => this.tick(), 
            20
        );
    }
    stop() {
        clearInterval(this.timerID);
    }
    handleEpsilonChange(event) {
        this.setState({epsilon: event.target.value});
        this.state.agent.setEpsilon(this.state.epsilon);
    }
    handleAlphaChange(event) {
        this.setState({alpha: event.target.value});
        this.state.agent.setAlpha(this.state.alpha);
    }
    handleGammaChange(event) {
        this.setState({gamma: event.target.value});
        this.state.agent.setGamma(this.state.gamma);
    }
    render() {
        return  <div>
                <div>
                    <Board board={this.state.agent.toBoard()}/>
                </div>
                <div>
                    <h1>Episodes:</h1>
                    <p>{this.state.episodes}</p>
                    <button onClick={() => this.start()}>
                        {this.state.started?"Resume":"Start"}
                    </button>
                    <button onClick={() => this.stop()}>
                        Stop
                    </button>
                    <button onClick={() => this.init()}>
                        Reset
                    </button>
                    <p>epsilon {this.state.epsilon}:</p>
                    <input id="epsilon" 
                           type="range" 
                           min="0" 
                           max="1" 
                           step="0.01" value={this.state.epsilon}  
                           onChange={this.handleEpsilonChange} />
                    <p>alpha {this.state.alpha}:</p>
                    <input id="alpha" 
                           type="range" 
                           min="0" 
                           max="1" 
                           step="0.01" value={this.state.alpha}  
                           onChange={this.handleAlphaChange} />
                    <p>gamma {this.state.gamma}:</p>
                    <input id="gamma" 
                           type="range" 
                           min="0" 
                           max="1" 
                           step="0.01" value={this.state.gamma}  
                           onChange={this.handleGammaChange} />
                </div>
                </div>
    }
}

export default Game;