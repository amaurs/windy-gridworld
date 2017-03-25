import Vector from './vector';

class Environment {
    constructor(height, width, board) {
        this.space = board.split("");
        this.width = width;
        this.height = height;
        this.agentSymbol = "o";
    }
    initEnvironment() {
        return new Vector(0, this.height - 4);
    }
    getPositionIndex(vector) {
        return vector.x + this.width * vector.y;
    }
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