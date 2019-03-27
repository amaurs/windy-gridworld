

class Environment {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    /**
     * This method returns an index that maps each position in the board to an interger. In
     * the case of the windy gridworld, each position represents an state that the agent can
     * be in.
     * @returns {number} the index of the position in the array that represents the world.
     */
    getState(){
        throw new Error("This method should be implemented by the subclass.");
    }

    /**
     * This method returns the total number of states in the windy gridworld. In this case
     * the number of states equals to the number of tiles in the board.
     * @returns {number} the number of states in the world.
     */
    getNumberOfStates() {
        throw new Error("This method should be implemented by the subclass.");
    }

    /**
     * This method returns the number of actions in this environment.
     * @returns {number} number of actions in this environment.
     */
    getNumberOfActions() {
        throw new Error("This method should be implemented by the subclass.");
    }

    /**
     * This will set the initial position for the agent.
     * @returns {vector} a vector with the initial position.
     */
    initEnvironment() {
        throw new Error("This method should be implemented by the subclass.");
    }

    getHeight() {
        return this.height;
    }

    getWidth() {
        return this.width;
    }
}

export { Environment as Environment };


