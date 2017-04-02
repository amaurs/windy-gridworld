import Agent from './agent.js';

class RandomAgent extends Agent {
    /**
     * This method implements the SARSA algorithm. It looks for the current state and
     * action, performs the action, gets the reward, and learns from the (S,A,R,S,A) tuple.
     */
    tick() {
        const state = this.environment.getState(this.position);
        const action = this.action;
        const stepRes = this.environment.tick(this.position, action);
        this.position = stepRes.position;
        const state = this.environment.getState(this.position);
        this.action = randomElement(this.epsilonGreedyPolicy(state, this.epsilon));
        return {"isDone" : stepRes.isDone,
                "reward" : stepRes.reward};
    }
}
export { RandomAgent as Agent };