class Vector {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
    /**
     * Scalar multiplication of the vector that this object represents.
     * @returns {vector} new vector.
     */
    times(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }
    /**
     * This is the usual vector addition except that it is bounded below in
     * the y dimension.
     * @returns {vector} new vector.
     */
    plusBoundedBelow(other, lowerBound) {
        let x = this.x + other.x;
        let y = this.y + other.y;
        if (y < lowerBound) {
            y = lowerBound;
        }
        return new Vector(x, y);
    }

    plus(other) {
        return new Vector(this.x + other.x, this.y + other.y);
    }

    /**
     * Helper method for debugging.
     * @returns {string} the representation of this object.
     */
    toString() {
        return "(" + this.x + "," + this.y + ")";
    }
}

export default Vector;