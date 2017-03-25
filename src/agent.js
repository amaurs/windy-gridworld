class Agent {
    constructor(environment) {
        this.environment = environment;
        this.position = null;
        this.initEpisode();
    }
    /**
     * This will set the initial position of the agent by asking the
     * environment where to start.
     */
    initEpisode() {
        this.position = this.environment.initEnvironment();
    }
    /**
     * This method will render the current environment including the
     * agent in its current position.
     * @returns {array} containing the rows in string format.
     */
    toBoard() {
        console.log("Agent position: "+ this.position); 
        return this.environment.toBoard(this.position);
    }
}


export default Agent;