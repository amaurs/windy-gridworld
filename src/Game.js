import React from 'react';
import Board from './Board.js';
import Arrows from './Arrows.js'
import { VictoryLine, VictoryChart, VictoryAxis } from 'victory';
import { Agent } from './qLearningAgent.js';
import { initGrid } from './util.js';

class Game extends React.Component{
    constructor(props) {
        super(props);
        const epsilon = 0.1;
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
            episodeDuration : 0, 
            data: [{episode:0,duration:0},{episode:0,duration:0}],
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
            episodes : 0})
    }
    componentDidMount() {

    }
    tick() {
        let stepRes = this.state.agent.tick();
        this.setState({episodeDuration: this.state.episodeDuration + 1});
        if(stepRes.isDone) {
            this.setState({episodes: this.state.episodes + 1});
            this.state.agent.initEpisode();
            let newData = this.state.data.slice();
            newData.push({episode : this.state.episodes, duration: this.state.episodeDuration});
            this.setState({data: newData});
            
            this.setState({episodeDuration: 0});
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
            50
        );
        this.state.agent.toActionMap()
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
        return  <div className="container">
                    <div className="board">
                        <Board board={this.state.agent.toBoard()}/>
                        <Arrows height={this.props.environment.height} 
                                width={this.props.environment.width}j 
                                size="42" 
                                arrows={this.state.agent.toActionMap()}/>
                    </div>

                    <div className="controls">
                        <h1>Episodes:</h1>
                        <p>{this.state.episodes}</p>
                        <h1>Episodes Duration:</h1>
                        <p>{this.state.episodeDuration}</p>
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