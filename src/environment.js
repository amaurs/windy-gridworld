import Vector from './vector';

class Environment {
    constructor(height, width, board) {
        this.space = board.split("");
        this.width = width;
        this.height = height;
        this.agentSymbol = "o";
    }
    /**
     * This will set the initial position for the agent.
     * @returns {vector} a vector with the initial position.
     */
    initEnvironment() {
        return new Vector(0, this.height - 4);
    }
    /**
     * Method that maps a (x,y) coordinate to the array representation.
     * @returns {vector} the index that holds the given position.
     */
    getPositionIndex(vector) {
        return vector.x + this.width * vector.y;
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