

class Controller {

    constructor(environment, agent) {
        this.environment = environment;
        this.agent = agent;
    }

    toBoard() {
        return this.environment.toBoard();
    }

    tick() {

        console.log("hello")
        return this.agent.tick(this.environment);
    }

    initEpisode() {
        return this.agent.initEpisode();
    }

    toActionMap() {
        return this.agent.toActionMap();
    }

    setEpsilon(epsilon) {
        return this.agent.setEpsilon(epsilon);
    }

    setAlpha(alpha) {
        return this.agent.setAlpha(alpha);
    }

    setGamma(gamma) {
        return this.agent.setGamma(gamma);
    }

    position() {
        return this.environment.agentPosition;
    }

    height() {
        return this.environment.height;
    }

    width() {
        return this.environment.width;
    }

}

export default Controller;