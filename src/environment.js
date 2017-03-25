class Environment {
    constructor(height, width, board) {
        this.space = board.split("");
        this.width = width;
        this.height = height;
    }
    toBoard(agent) {
        const copy = Array(this.height);
        const spaceCopy = this.space.slice();
        for(let i = 0; i < this.height; i++) {
            copy[i] = spaceCopy.slice(i * this.width, (i + 1) * this.width   );
        }
        return copy;
    }
}

export default Environment;