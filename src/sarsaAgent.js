import Agent from './agent';

class SarsaAgent extends Agent {
    /**
     * This method moves the agent one position. It moves the agent to the new position, 
     * by selecting the next action using the greedy policy. It reports to the caller if
     * the episode has ended and the reward that this step gives.
     * @returns {Object} information on the sate of the agent.
     */
    tick() {
        const state = this.environment.getState(this.position);
        const action = this.action;
        const stepRes = this.environment.tick(this.position, action);
        const reward = stepRes.reward;
        const statePrime = this.environment.getState(stepRes.position);
        const actionPrime = this.epsilonGreedyPolicy(statePrime, this.epsilon);
        this.Q[this.indexStateAction(state, action)] = this.Q[this.indexStateAction(state, action)] + 
                                                       this.alpha * (reward + 
                                                                     this.gamma * this.Q[this.indexStateAction(statePrime, actionPrime)] -
                                                                     this.Q[this.indexStateAction(state, action)]);
        this.position = stepRes.position;
        this.action = actionPrime;
        return {"isDone" : stepRes.isDone,
                "reward" : stepRes.reward};
    }
}

export { SarsaAgent as Agent };