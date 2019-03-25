import { Environment } from './environment.js';
import Vector from './vector.js';

const plan  =           ["#################################################",
                         "#    #     #                                    #",
                         "#                      o    o                   #",
                         "#     o   *            o               o    $   #",
                         "#         *#####       o                        #",
                         "#         *#   #       o    ###                 #",
                         "#   o        ##        o   #  #            ##   #",
                         "#          ###         o   #  #      o       #  #",
                         "##                         #  #               # #",
                         "###    o        o    $        #                 #",
                         "#                 $           #    #      $     #",
                         "#             *               #                 #",
                         "#    ####                     #       *         #",
                         "#    ##     * *       #     o                   #",
                         "#    #    *****                     $      ###  #",
                         "#     #             $                 *         #",
                         "#         *#   # *           #    #   *         #",
                         "#     o      ## *                #    *    ##   #",
                         "#     $  * ### *                #     *      #  #",
                         "##          * *                #      *       # #",
                         "###    *                      #       *  *      #",
                         "#        $            $      #        *         #",
                         "#             *              #    $   *    $    #",
                         "#    ####                 ## #        *    o    #",
                         "#    ##     * *          $            *         #",
                         "#    #    *****       o               *    ###  #",
                         "#     #                                         #",
                         "#################################################"];

const ACTIONS = [new Vector(0, 1), //DOWN
                 new Vector(0, -1), //UP
                 new Vector(-1, 0), //LEFT
                 new Vector(1, 0)]; //RIGHT


class ElectronicLife extends Environment {

    constructor() {
        super(plan[0].length, plan.length);
        this.space = plan;
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

    toBoard() {
        return this.space.map(function(row) { return row.split("") });
    }

}

class Grid {
    constructor() {

    }
}

class World {
    constructor() {

    }
}

class Critter {
    constructor() {

    }

    act() {

    }
}

class Plant extends Critter {
    constructor() {

    }
}

class PlantEater extends Critter {
    constructor() {

    }
}

class PlantEaterEater extends Critter {
    constructor() {

    }
}



export { ElectronicLife as Environment, plan as map};

