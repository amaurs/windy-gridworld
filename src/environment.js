import Vector from './vector';

const ACTIONS = [new Vector(0, 1), //DOWN
                 new Vector(0, -1), //UP
                 new Vector(-1, 0), //LEFT
                 new Vector(1, 0)]; //RIGHT

class Environment {
    constructor(height, width, board, wind, agentSymbol, goalSymbol) {
        this.space = board.split("");
        this.width = width;
        this.height = height;
        this.wind = wind.map((element) => {return (new Vector(0, -1)).times(element)});
        this.agentSymbol = agentSymbol;
        this.goalSymbol = goalSymbol;
    }
    /**
     * This method moves the state of the agent
     * @returns {Object} object containing the new position, the reward, and a boolean that tells if the episode ended.
     */
    tick(agent, actionIndex) {
        const increment = ACTIONS[actionIndex];
        const wind = this.wind[agent.x];
        let newPosition = agent.plusBoundedBelow(increment, 0).plusBoundedBelow(wind, 0);
        let reward = -1;
        let goal = false;
        // If the new position lies outside of the board we don't move, but the reward is -1.
        if(!this.isInside(newPosition)) {
            newPosition = agent;
        }
        // If the new position reachs the goal we give a positive reward and the episode ends.
        if(this.space[this.getPositionIndex(newPosition)] === this.goalSymbol) {
            newPosition = this.initEnvironment();
            reward = 10;
            goal = true;
        }
        return {"position": newPosition,
                "isDone": goal,
                "reward": reward
                };
    }
    /**
     * This method returns the total number of states in the windy gridworld. In this case
     * the number of states equals to the number of tiles in the board.
     * @returns {number} the number of states in the world.
     */
    getNumberOfStates() {
        return this.width * this.height;
    }
    /**
     * This method returns an index that maps each position in the board to an interger. In
     * the case of the windy gridworld, each position represents an state that the agent can
     * be in.
     * @returns {number} the index of the position in the array that represents the world.
     */
    getState(agentPosition){
        return this.getPositionIndex(agentPosition);
    }
    /**
     * Returns the indexes of the array of actions in this environment.
     * @returns {array} array with the indexes of the actions.
     */
    getActions() { 
        return ACTIONS.map((action,index)=>{return index});
    }
    /**
     * This method returns the number of actions in this environment.
     * @returns {number} number of actions in this environment.
     */
    getNumberOfActions() {
        return ACTIONS.length;
    }
    /**
     * Method that maps a (x,y) coordinate to the array representation.
     * @returns {vector} the index that holds the given position.
     */
    getPositionIndex(vector) {
        return vector.x + this.width * vector.y;
    }
    /**
     * Helper method to determine if the given vector is inside the board.
     * @returns {boolean} true if the position is inside the board; false otherwise.
     */
    isInside(vector) {
        return vector.x >= 0 && 
               vector.x < this.width &&
               vector.y >= 0 && 
               vector.y < this.height;
    }
    /**
     * This will set the initial position for the agent.
     * @returns {vector} a vector with the initial position.
     */
    initEnvironment() {
        return new Vector(0, this.height - 4);
    }
    /**
     * This method takes the position of an array and creates an array containing
     * the string representation of the current board including the position of the 
     * agent.
     * @param {vector} with the current position of the agent.
     * @returns {array} containing the rows in string format.
     */
    toBoard(agent) {
        const copy = Array(this.height);
        const spaceCopy = this.space.slice();
        spaceCopy[this.getPositionIndex(agent)] = this.agentSymbol;
        for(let i = 0; i < this.height; i++) {
            copy[i] = spaceCopy.slice(i * this.width, (i + 1) * this.width   );
        }
        return copy;
    }
}

export default Environment;