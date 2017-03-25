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
     * This should be implemented by the class that inherits from agent. It should return
     * an object that contains information abour the reward and if the episode ended in this step.
     * The object should be in the form of {"isDone": value, "reward": value}.
     * @returns {Object} information on the sate of the agent.
     */
    tick() {
        throw new Error("This method should be implemented by the subclass.");
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