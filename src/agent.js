import {argMax, randomElement} from './util.js'

class Agent {
    constructor(environment) {
        this.environment = environment;
        this.Q = new Array(this.environment.getNumberOfStates() * this.environment.getNumberOfActions()).fill(0);
        this.position = null;
        this.action = null
        this.epsilon = .9;
        this.initEpisode();
    }
    /**
     * This method moves the agent one position. It moves the agent to the new position, 
     * by selecting the next action using the greedy policy. It reports to the caller if
     * the episode has ended and the reward that this step gives.
     * @returns {Object} information on the sate of the agent.
     */
    tick() {
        let state = this.environment.getState(this.position);
        const action = this.action;    
        const stepRes = this.environment.tick(this.position, action);
        
        this.position = stepRes.position;
        state = this.environment.getState(this.position);
        this.action = this.epsilonGreedyPolicy(state);
        return {"isDone" : stepRes.isDone,
                "reward" : stepRes.reward};
    }
    /**
     * This methods implements a epsilon-greedy policy, (1 - epsilon) of the time
     * it selects the action that has the best return, the rest of the time it selects
     * randomly from all the actions. 
     * @returns {number} the index of the selected action.
     */
    epsilonGreedyPolicy(state) { 
        const actionsIndex = this.environment.getActions(); 
        let actionStateValue = [];
        for(let i = 0; i < actionsIndex.length; i++) {
            actionStateValue.push(this.Q[this.indexStateAction(state, actionsIndex[i])]);
        }
        const argMaxActions = argMax(actionStateValue);
        if(Math.random() < 1) {
            return randomElement(actionsIndex);
        } else {
            return randomElement(argMaxActions);
        }
    }
    /**
     * Helper method that maps each (state, action) pair to a single integer.
     * @returns an integer representing the (state, action) pair.
     */
    indexStateAction(state, action) {
        return state * this.environment.getNumberOfActions() + action;
    }
    /**
     * This will set the initial position of the agent by asking the
     * environment where to start.
     */
    initEpisode() {
        this.position = this.environment.initEnvironment();
        this.action = this.epsilonGreedyPolicy(this.environment.getState(this.position));
    }
    /**
     * This method will render the current environment including the
     * agent in its current position.
     * @returns {array} containing the rows in string format.
     */
    toBoard() {
        return this.environment.toBoard(this.position);
    }
}


export default Agent;