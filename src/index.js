import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Game.js';
import Environment from './environment';
import Controller from './controller';
import { Agent } from './qLearningAgent.js';
import './board.css';

const map = {
             boardPlan : "          "+
                         "          "+
                         "          "+
                         "       %  "+
                         "          "+
                         "          "+
                         "          ",
             height : 7,
             width : 10,
             wind : [0,0,0,1,1,1,2,2,1,0],
             agent : "o",
             goal : "%"
         };

const environment = new Environment(map.height, 
                                     map.width, 
                                     map.boardPlan,
                                     map.wind,
                                     map.agent,
                                     map.goal)

const agent = new Agent(environment);

const controller = new Controller(environment, agent)

ReactDOM.render(
  <Game controller={controller} />,
  document.getElementById('world')
);
