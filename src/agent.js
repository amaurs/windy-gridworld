import {argMax, randomElement} from './util.js'
import Vector from './vector.js'


class Agent {
    constructor(numberOfActions, numberOfStates) {
        this.numberOfStates = numberOfStates;
        this.numberOfActions = numberOfActions;
        this.Q = new Array(this.numberOfStates * this.numberOfActions).fill(0);
        this.alpha = 0.8;
        this.gamma = 0.4;
        this.epsilon = 0.1;
    }

    /**
     * This should be implemented by the class that inherits from agent. It should return
     * an object that contains information abour the reward and if the episode ended in this step.
     * The object should be in the form of {"isDone": value, "reward": value}.
     * @returns {Object} information on the sate of the agent.
     */
    tick(state, reward) {
        throw new Error("This method should be implemented by the subclass.");
    }

    /**
     * This methods implements a epsilon-greedy policy, (1 - epsilon) of the time
     * it selects the action that has the best return, the rest of the time it selects
     * randomly from all the actions. 
     * @returns {number} the index of the selected action.
     */
    epsilonGreedyPolicy(state, epsilon) {
        const actionsIndex = []; 
        let actionStateValue = [];
        for(let i = 0; i < this.numberOfActions; i++) {
            actionStateValue.push(this.Q[this.indexStateAction(state, i)]);
            actionsIndex.push(i); // There should be a cleaner way to accomplish this.
        }   
        const argMaxActions = argMax(actionStateValue);
        if(Math.random() < epsilon) {

            if(actionsIndex.length == 0) {
                debugger
            }
            return actionsIndex;
        } else {
            if(argMaxActions.length == 0) {
                debugger
            }
            return argMaxActions;
        }
    }

    /**
     * Helper method that maps each (state, action) pair to a single integer.
     * @returns an integer representing the (state, action) pair.
     */
    indexStateAction(state, action) {
        return state * this.numberOfActions + action;
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

    toActionMap() {
        let map = [];
        for(let i = 0; i < this.numberOfStates; i++) {
            // deterministic, I choose the first element of the list
            let actions = new Array(this.numberOfActions).fill(0);
            this.epsilonGreedyPolicy(i, 0).map((element)=>{ actions[element] = 1});
            map.push(actions);
        }
        return map;
    }
}


export { Agent as Agent };


