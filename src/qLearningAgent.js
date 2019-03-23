import { Agent } from './agent';
import {argMax, randomElement} from './util.js'

class QLearningAgent extends Agent {

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
            qActionValues.push(this.Q[this.indexStateAction(statePrime, i)]);
        }
        const argMaxAction = randomElement(argMax(qActionValues));
        this.Q[this.indexStateAction(state, action)] = this.Q[this.indexStateAction(state, action)] + 
                                                       this.alpha * (reward + 
                                                                     this.gamma * this.Q[this.indexStateAction(statePrime, argMaxAction)] -
                                                                     this.Q[this.indexStateAction(state, action)]);
        return {"isDone" : stepRes.isDone,
                "reward" : stepRes.reward};
    }
    
}

export { QLearningAgent as Agent };