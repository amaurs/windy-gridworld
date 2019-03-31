import { Agent } from './agent';
import { argMax, randomElement, randomInt } from './util.js';


class SarsaAgent extends Agent {
    constructor(numberOfActions, numberOfStates) {
        super(numberOfActions, numberOfStates);
        this.action = randomInt(numberOfActions);
    }
    /**
     * This method moves the agent one position. It moves the agent to the new position, 
     * by selecting the next action using the greedy policy. It reports to the caller if
     * the episode has ended and the reward that this step gives.
     * @returns {Object} information on the sate of the agent.
     */
    tick(environment) {
        const state = environment.getState();
        const action = this.action;
        const stepRes = environment.tick(action);
        const reward = stepRes.reward;
        const statePrime = environment.getState();

        const actionPrime = randomElement(this.epsilonGreedyPolicy(statePrime, this.epsilon));
        
        if(actionPrime==undefined){
            debugger
        }

        this.Q[this.indexStateAction(state, action)] = this.Q[this.indexStateAction(state, action)] + 
                                                       this.alpha * (reward + 
                                                                     this.gamma * this.Q[this.indexStateAction(statePrime, actionPrime)] -
                                                                     this.Q[this.indexStateAction(state, action)]);
        this.action = actionPrime;
        return {"isDone" : stepRes.isDone,
                "reward" : stepRes.reward};
    }
}

export { SarsaAgent as Agent };

