import Agent from './agent';
import {argMax, randomElement} from './util.js'

class DoubleQLearningAgent extends Agent {
    constructor(environment) {
        super(environment);
        this.environment = environment;
        this.Q = new Array(this.environment.getNumberOfStates() * this.environment.getNumberOfActions()).fill(0);
        this.Q2 = new Array(this.environment.getNumberOfStates() * this.environment.getNumberOfActions()).fill(0);
        this.initEpisode();
    }
    /**
     * 
     * @returns {Object} information on the sate of the agent.
     */
    tick() {
        const state = this.environment.getState(this.position);
        const action = this.epsilonGreedyPolicy(state, this.epsilon);
        const stepRes = this.environment.tick(this.position, action);
        const reward = stepRes.reward;
        const statePrime = this.environment.getState(stepRes.position);
        let qActionValues = [];
        for(let i=0; i < this.environment.getNumberOfActions(); i++) {
            qActionValues.push(this.Q[this.indexStateAction(state, i)]);
        }
        const argMaxAction = randomElement(argMax(qActionValues));

        if(Math.random() < 0.5) {
            this.Q[this.indexStateAction(state, action)] = this.Q[this.indexStateAction(state, action)] + 
                                                       this.alpha * (reward + 
                                                                     this.gamma * this.Q[this.indexStateAction(statePrime, argMaxAction)] -
                                                                     this.Q[this.indexStateAction(state, action)]);
        } else {
            this.Q2[this.indexStateAction(state, action)] = this.Q2[this.indexStateAction(state, action)] + 
                                                       this.alpha * (reward + 
                                                                     this.gamma * this.Q2[this.indexStateAction(statePrime, argMaxAction)] -
                                                                     this.Q2[this.indexStateAction(state, action)]);
        }
        
        this.position = stepRes.position;
        return {"isDone" : stepRes.isDone,
                "reward" : stepRes.reward};
    }
    /**
     * This methods implements a epsilon-greedy policy, (1 - epsilon) of the time
     * it selects the action that has the best return, the rest of the time it selects
     * randomly from all the actions. 
     * @returns {number} the index of the selected action.
     */
    epsilonGreedyPolicy(state, epsilon, deterministic=false) { 
        const actionsIndex = this.environment.getActions(); 
        let actionStateValue = [];
        for(let i = 0; i < actionsIndex.length; i++) {
            actionStateValue.push(this.Q[this.indexStateAction(state, actionsIndex[i])] + this.Q2[this.indexStateAction(state, actionsIndex[i])]);
        }   
        const argMaxActions = argMax(actionStateValue);
        if(Math.random() < epsilon) {
            return randomElement(actionsIndex);
        } else {
            if(deterministic) {
                return argMaxActions[0];
            } else {
                return randomElement(argMaxActions);
            }
        }
    }
    /**
     * This will set the initial position of the agent by asking the
     * environment where to start.
     */
    initEpisode() {
        this.position = this.environment.initEnvironment();
    }
}

export { DoubleQLearningAgent as Agent };