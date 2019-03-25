

class Controller {

    constructor(environment, agent) {
        this.environment = environment;
        this.agent = agent;
    }

    toBoard() {
        return this.environment.toBoard();
    }

    initEpisode() {
        return this.environment.initEnvironment();
    }

    height() {
        return this.environment.getHeight();
    }

    width() {
        return this.environment.getWidth();
    }

    tick() {
        return this.agent.tick(this.environment);
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

    toActionMap() {
        return this.agent.toActionMap();
    }

}

export default Controller;