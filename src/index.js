import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Game.js';
import { Environment, map} from './electronicLife.js';
import Controller from './controller';
import { Agent } from './qLearningAgent.js';
import './board.css';


const environment = new Environment(map.height, 
                                     map.width, 
                                     map.boardPlan,
                                     map.wind,
                                     map.agent,
                                     map.goal)

const agent = new Agent(environment.getNumberOfActions(), environment.getNumberOfStates());

const controller = new Controller(environment, agent)

ReactDOM.render(
  <Game controller={controller} />,
  document.getElementById('world')
);
