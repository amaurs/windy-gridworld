import { Environment } from './environment.js';
import Vector from './vector.js';
import { randomElement } from './util.js';

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

const directions = {
                      "n"  : new Vector( 0, -1),
                      "ne" : new Vector( 1, -1),
                      "e"  : new Vector( 1,  0),
                      "se" : new Vector( 1,  1),
                      "s"  : new Vector( 0,  1),
                      "sw" : new Vector(-1,  1),
                      "w"  : new Vector(-1,  0),
                      "nw" : new Vector(-1, -1),
                   };



function elementFromChar(legend, ch) { 
    if(ch == " ") {
        return null;
    }
    let element = new legend[ch]();
    element.originChar = ch;
    return element;
} 

function charFromElement(element){
    if(element == null) {
        return " ";
    }
    else {
        return element.originChar;
    }
}




class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.space = new Array(width * height);
    }

    isInside(vector) {
        return vector.x >= 0 && vector.x < this.width &&
               vector.y >= 0 && vector.y < this.height;
    }

    forEach(f, context) {
        for(let y = 0; y < this.height; y++) {
            for(let x = 0; x < this.width; x++) {
                let value = this.space[x + y * this.width];
                if(value != null) {
                    f.call(context, value, new Vector(x, y));
                }
            }
        }
    }

    get(vector) {
        return this.space[vector.x + this.width * vector.y];
    }

    set(vector, value) {
        this.space[vector.x + this.width * vector.y] = value;
    }
}

class World {
    constructor(map, legend) {
        // Internal representation of the map.
        let grid = new Grid(map[0].length, map.length);
        this.grid = grid;
        this.legend = legend;
        map.forEach(function (line, y) {
            for (let x = 0; x < line.length; x++){
                grid.set(new Vector(x, y), elementFromChar(legend, line[x]));
            }
        });
    }

    turn() {
        const acted = [];
        this.grid.forEach(function(critter, vector) {
            if (critter.act && acted.indexOf(critter) == -1) {
                acted.push(critter);
                this.letAct(critter, vector);
            }
        }, this);
    }

    letAct(critter, vector) {
        let action = critter.act(new View(this, vector)); 
        if (action && action.type == "move") {
            let dest = this.checkDestination(action , vector);
            if(dest && this.grid.get(dest) == null) {
                this.grid.set(vector , null);
                this.grid.set(dest, critter); 
            }
        } 
    }

    checkDestination (action, vector) {
        if (directions.hasOwnProperty(action.direction)) {
            let dest = vector.plus(directions[action.direction]);
            if(this.grid.isInside(dest)){
                return dest;
            }
        }
    }

    toString() {
        let stringMap = [];
        ////console.log(this.grid);
        for(let y = 0; y < this.grid.height; y++){
            let row = "";
            for(let x = 0; x < this.grid.width; x++){
                let element = this.grid.get(new Vector(x,y));
                row += charFromElement(element);
            }
            stringMap.push(row);
        }
        return stringMap.map(function(row) { return row.split("") });
    }
}

class LifeLikeWorld extends World {
    constructor(map, legend) {
        super(map, legend);
    }

    letAct(critter, vector) {
        let action = critter.act(new View(this, vector));
        let handled = action &&
                      action.type in this &&
                      this[action.type].call(this, critter, vector, action);
        if (!handled) {
            critter.energy -= 0.2;
            if(critter.energy <= 0) {
                this.grid.set(vector, null);
            }
        }
    }

    grow(critter) {
        critter.energy += 0.5;
        return true;
    }

    move(critter, vector, action) {
        let dest = this.checkDestination(action, vector);
        if (dest == null ||
                critter.energy <= 1 ||
                this.grid.get(dest) != null){
            return false;
        }
        critter.energy -= 1;
        this.grid.set(vector, null);
        this.grid.set(dest, critter);
        return true;
    }

    eat(critter, vector, action) {
        let dest = this.checkDestination(action, vector);
        let atDest = dest != null && this.grid.get(dest);
        if(!atDest || atDest.energy == null) {
            return false;
        }
        critter.energy += atDest.energy;
        this.grid.set(dest, null);
        return true;
    }

    reproduce(critter, vector, action) {
        let baby = elementFromChar(this.legend, critter.originChar);
        let dest = this.checkDestination(action, vector);
        if(dest == null ||
                critter.energy <=2 * baby.energy ||
                this.grid.get(dest) != null) {
            return false;
        }
        critter.energy -= 2 * baby.energy;
        this.grid.set(dest, baby);
        return true;
    }
}

class View {
    constructor(world, vector) {
        this.world = world;
        this.vector = vector;
    }

    look(dir) {
        let target = this.vector.plus(directions[dir]);
        if(this.world.grid.isInside(target)){
            return charFromElement(this.world.grid.get(target));
        }
        else {
            return "#";
        }
    }

    findAll(ch) {
        let found = [];
        for(let dir in directions) {
            if(this.look(dir) == ch){
                found.push(dir);
            }

        }
        return found; 
    }

    find(ch) {
        var found = this.findAll(ch);
        if (found.length == 0) {
            return null;
        }
        return randomElement(found);
    }
}



class Critter {
    constructor() {

    }

    act() {

    }
}

class Wall extends  Critter {
    constructor() {
        super();
    }

    act() {

    }
}

class Plant extends Critter {
    constructor() {
        super();
        this.energy = 3 + Math.random() * 4;
    }

    act(context) {
        if(this.energy > 15) {
            let space = context.find(" ");
            if(space) {
                return {type: "reproduce", direction: space};
            }
        
        }
        if(this.energy < 20) {
            return {type: "grow"};
        }
    }
}

class PlantEater extends Critter {
    constructor() {
        super();
        this.energy = 20;
        this.food = "*";
    }

    act(context) {
        let space = context.find(" ");
        if(this.energy > 60 && space)
        {
            return {type: "reproduce", direction: space};
        }
        let food = context.find(this.food);
        if(food)
        {
            return {type: "eat", direction: food};
        }       
        if(space)
        {
            return {type: "move", direction: space};
        }
    }
}

class PlantEaterEater extends PlantEater {
    constructor() {
        super();
        this.energy = 50;
        this.food = "o";
    }
}

class ElectronicLife extends Environment {

    constructor() {
        super(plan[0].length, plan.length);
        this.space = plan;

        this.world = new LifeLikeWorld(plan, {
                                              "#": Wall,
                                              "o": PlantEater,
                                              "$": PlantEaterEater,
                                              "*": Plant
                                              });

    }

    tick(actionIndex) {
        this.world.turn();

        return {"isDone" : false,
                "reward" : 1};
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
        return this.world.toString();
    }

    getState(){
        return 0;
    }

}

export { ElectronicLife as Environment, plan as map};

