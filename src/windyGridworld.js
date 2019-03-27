import { Environment } from './environment.js';
import Vector from './vector.js';

const ACTIONS = [new Vector(0, 1), //DOWN
                 new Vector(0, -1), //UP
                 new Vector(-1, 0), //LEFT
                 new Vector(1, 0)]; //RIGHT

const map = {
             boardPlan : "          "+
                         "          "+
                         "          "+
                         "       %  "+
                         "          "+
                         "          "+
                         "          ",
             height : 7,
             width : 10,
             wind : [0,0,0,1,1,1,2,2,1,0],
             agent : "o",
             goal : "%"
         };


class WindyGridworld extends Environment {

    constructor(height, width, board, wind, agentSymbol, goalSymbol) {
        super();
        this.space = board.split("");
        this.width = width;
        this.height = height;
        this.wind = wind.map((element) => {return (new Vector(0, -1)).times(element)});
        this.agentSymbol = agentSymbol;
        this.goalSymbol = goalSymbol;
        this.agentPosition = new Vector(0, this.height - 4);
    }

        /**
     * This method moves the state of the agent
     * @returns {Object} object containing the new position, the reward, and a boolean that tells if the episode ended.
     */
    tick(actionIndex) {
        const increment = ACTIONS[actionIndex];
        const wind = this.wind[this.agentPosition.x];
        let newPosition = this.agentPosition.plusBoundedBelow(increment, 0).plusBoundedBelow(wind, 0);
        let reward = -1;
        let goal = false;
        // If the new position lies outside of the board we don't move, but the reward is -1.
        if(!this._isInside(newPosition)) {
            newPosition = this.agentPosition;
        }
        // If the new position reachs the goal we give a positive reward and the episode ends.
        if(this.space[this._getPositionIndex(newPosition)] === this.goalSymbol) {
            this.initEnvironment();
            reward = 10;
            goal = true;
        }


        this.agentPosition = newPosition;

        return {
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
     * This method returns the number of actions in this environment.
     * @returns {number} number of actions in this environment.
     */
    getNumberOfActions() {
        return ACTIONS.length;
    }

    /**
     * This will set the initial position for the agent.
     * @returns {vector} a vector with the initial position.
     */
    initEnvironment() {
        this.agentPosition = new Vector(0, this.height - 4);
    }

    /**
     * This method returns an index that maps each position in the board to an interger. In
     * the case of the windy gridworld, each position represents an state that the agent can
     * be in.
     * @returns {number} the index of the position in the array that represents the world.
     */
    getState(){
        console.log("Deprecated, should use getPositionIndex instead");
        return this._getPositionIndex(this.agentPosition);
    }

    /**
     * Method that maps a (x,y) coordinate to the array representation.
     * @returns {vector} the index that holds the given position.
     */
    _getPositionIndex(vector) {
        return vector.x + this.width * vector.y;
    }

    /**
     * Helper method to determine if the given vector is inside the board.
     * @returns {boolean} true if the position is inside the board; false otherwise.
     */
    _isInside(vector) {
        return vector.x >= 0 && 
               vector.x < this.width &&
               vector.y >= 0 && 
               vector.y < this.height;
    }

    /**
     * This method takes the position of an array and creates an array containing
     * the string representation of the current board including the position of the 
     * agent.
     * @returns {array} containing the rows in string format.
     */
    toBoard() {
        const copy = Array(this.height);
        const spaceCopy = this.space.slice();
        spaceCopy[this._getPositionIndex(this.agentPosition)] = this.agentSymbol;
        for(let i = 0; i < this.height; i++) {
            copy[i] = spaceCopy.slice(i * this.width, (i + 1) * this.width);
        }
        return copy;
    }

}


export { WindyGridworld as Environment, map};