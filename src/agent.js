class Agent {
    constructor(environment) {
        this.environment = environment;
        this.position = null;
        this.initEpisode();
    }
    initEpisode() {
        this.position = this.environment.initEnvironment();
    }
    toBoard() {
        console.log("Agent position: "+ this.position); 
        return this.environment.toBoard(this.position);
    }
}


export default Agent;