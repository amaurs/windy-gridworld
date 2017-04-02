import {argMax, randomElement} from './util.js'
import Vector from './vector.js'

class Agent {
    constructor(environment) {
        this.environment = environment;
        this.Q = new Array(this.environment.getNumberOfStates() * this.environment.getNumberOfActions()).fill(0);
        this.position = null;
        this.action = null
        this.alpha = 0.8;
        this.gamma = 0.4;
        this.epsilon = 0.1;
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
    epsilonGreedyPolicy(state, epsilon) {
        const actionsIndex = this.environment.getActions(); 
        let actionStateValue = [];
        for(let i = 0; i < actionsIndex.length; i++) {
            actionStateValue.push(this.Q[this.indexStateAction(state, actionsIndex[i])]);
        }   
        const argMaxActions = argMax(actionStateValue);
        if(Math.random() < epsilon) {
            return actionsIndex;
        } else {
            return argMaxActions;
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
        this.action = randomElement(this.epsilonGreedyPolicy(this.environment.getState(this.position), this.epsilon));
    }
    /**
     * This method will render the current environment including the
     * agent in its current position.
     * @returns {array} containing the rows in string format.
     */
    toBoard() {
        return this.environment.toBoard(this.position);
    }
    toActionMap() {
        let map = [];
        for(let i = 0; i < this.environment.getNumberOfStates(); i++) {
            // deterministic, I choose the first element of the list
            let actions = new Array(this.environment.getNumberOfActions()).fill(0);
            this.epsilonGreedyPolicy(i, 0).map((element)=>{ actions[element] = 1});
            map.push(actions);
        }
        return map;
    }
    /**
     * Helper method to update the value of epsilon.
     */
    setEpsilon(epsilon) {
        this.epsilon = epsilon;
    }
    /**
     * Helper method to update the value of alpha.
     */
    setAlpha(alpha) {
        this.alpha = alpha;
    }
    /**
     * Helper method to update the value of gamma.
     */
    setGamma(gamma) {
        this.gamma = gamma;
    }
}


export default Agent;