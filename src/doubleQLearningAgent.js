import { Agent } from './agent';
import { argMax, randomElement } from './util.js'

class DoubleQLearningAgent extends Agent {
    constructor(numberOfActions, numberOfStates) {
        super(numberOfActions, numberOfStates);
        this.Q = new Array(numberOfStates * numberOfActions).fill(0);
        this.Q2 = new Array(numberOfStates * numberOfActions).fill(0);
    }
    /**
     * 
     * @returns {Object} information on the sate of the agent.
     */
    tick(environment) {
        const state = environment.getState();
        const action = randomElement(this.epsilonGreedyPolicy(state, this.epsilon));
        const stepRes = environment.tick(action);
        const reward = stepRes.reward;
        const statePrime = environment.getState();
        let qActionValues = [];
        for(let i=0; i < this.numberOfActions; i++) {
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
        
        return {"isDone" : stepRes.isDone,
                "reward" : stepRes.reward};
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
            actionStateValue.push(this.Q[this.indexStateAction(state, i)] + this.Q2[this.indexStateAction(state, i)]);
            actionsIndex.push(i); // There should be a cleaner way to accomplish this.
        }   
        const argMaxActions = argMax(actionStateValue);
        if(Math.random() < epsilon) {
            return actionsIndex;
        } else {
            return argMaxActions;
        }
    }
    /**
     * This will set the initial position of the agent by asking the
     * environment where to start.
     */
    initEpisode() {
       this.environment.initEnvironment();
    }
}

export { DoubleQLearningAgent as Agent };
