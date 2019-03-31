import { Environment } from './environment.js';
import Vector from './vector.js';
import { randomElement } from './util.js';

const plan  =           ["#########################",
                         "#    #     #            #",
                         "#                   $   #",
                         "#     o   *    o        #",
                         "#         *###          #",
                         "# *       *#            #",
                         "#   o        #     ##   #",
                         "#          ###       #  #",
                         "##                    # #",
                         "###    o   *            #",
                         "#                 $     #",
                         "#  $ *                  #",
                         "#    ####     *     o   #",
                         "#    ##     *           #",
                         "#########################"];


const plan2  =           ["#################################################",
                         "#    #     #                                    #",
                         "#                      o    o                   #",
                         "#     o   *            o               o        #",
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
                         "#    #    *****                            ###  #",
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


const ACTIONS = [{key: "Plant",
                  value: 1},
                 {key: "Plant",
                  value: 0},
                 {key: "Plant",
                  value: -1},
                 {key: "PlantEater",
                  value: 1},
                 {key: "PlantEater",
                  value: 0},
                 {key: "PlantEater",
                  value: -1},
                 {key: "PlantEaterEater",
                  value: 1},
                 {key: "PlantEaterEater",
                  value: 0},
                 {key: "PlantEaterEater",
                  value: -1}];

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

let reproduceLimits = {
                        "Plant" : 15,
                        "PlantEater" : 50,
                        "PlantEaterEater" : 50
                     }



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

function createStateMap2() {
    let mapping = {};
    for(let i = 0; i < 100 + 1; i++) {
        mapping[(100 - i) + "-" + i] = i;
    }
    return mapping;
}


function createStateMap3() {
    let mapping = {};
    let count = 0;
    for(let i = 0; i < 100 + 1; i++) {
        for(let j = 0; j < i + 1; j++) {
            mapping[(100 - i) + "-" + (i - j) + "-" + j] = count;
            count++;
        }
    }
    return mapping;
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
        this.time = 0;
        map.forEach(function (line, y) {
            for (let x = 0; x < line.length; x++){
                grid.set(new Vector(x, y), elementFromChar(legend, line[x]));
            }
        });
    }

    turn() {
        const acted = [];
        let time = this.time;
        let census = {};
        this.grid.forEach(function(critter, vector) {
            if (critter.act && acted.indexOf(critter) == -1) {
                acted.push(critter);
                let example = time % critter.speed;
                if(example == 0) {
                    this.letAct(critter, vector);                    
                }   
                critter.growOlder();
                if(!critter.isAlive()) {
                    this.grid.set(vector , null);
                }

                let currentCritter = critter.constructor.name;
                if(census.hasOwnProperty(currentCritter)) {
                    census[currentCritter] += 1;
                } else {
                    census[currentCritter] = 1;
                }

            }
        }, this);
        this.time++;
        return census;
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
                //critter.energy <= 2 * baby.energy ||
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
        this.speed = 1;
        this.age = 0;
        this.ageLimit = 50;
    }

    act() {

    }

    growOlder() {
        this.age++;
    }

    isAlive() {
        return (this.age < this.ageLimit);
    }

}

class Wall {
    constructor() {
    }
}

class Plant extends Critter {
    constructor() {
        super();
        this.energy = 3 + Math.random() * 4;
        this.speed = 1;
    }

    act(context) {
        if(this.energy > reproduceLimits[this.constructor.name]) {
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
        this.energy = 50;
        this.food = "*";
        this.reproduceLimit = 60;
        this.speed = 3;
    }

    act(context) {
        let space = context.find(" ");
        let food = context.find(this.food);
        if(this.energy > reproduceLimits[this.constructor.name] && space)
        {
            return {type: "reproduce", direction: space};
        }
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
        this.energy = 100;
        this.food = "o";
        this.reproduceLimit = 60;
        this.speed = 2;
    }

}

class ElectronicLife extends Environment {

    constructor() {
        super(plan[0].length, plan.length);
        this.space = plan;
        this.stateMapping = createStateMap3();
        
        this.world = new LifeLikeWorld(plan, {
                                              "#": Wall,
                                              "o": PlantEater,
                                              "$": PlantEaterEater,
                                              "*": Plant
                                              });

        this.makeCensus();


    }

    makeCensus() {
        let current  = this.toBoard().map(function(row) {
            return row.join("");
        }).join("");
        this.plantN = (current.match(/o/g) || []).length;
        this.plantEaterN = (current.match(/\$/g) || []).length;
        this.plantEaterEaterN = (current.match(/\*/g) || []).length;

    }

    tick(actionIndex) {
        
        let action = ACTIONS[actionIndex];

        console.log(actionIndex)
        console.log(ACTIONS)
        console.log(reproduceLimits);
        let latest = reproduceLimits[action.key];

        latest += action.value;

        if(!(latest < 1)) {
            reproduceLimits[action.key] += action.value;
        }

        

        this.world.turn();

        this.makeCensus();



        let done = (this.plantN == 0 ||
                    this.plantEaterN == 0 ||
                    this.plantEaterEaterN == 0);

        return {"isDone" : done,
                "reward" : done?-10:.1};
    }

    /**
     * This method returns the total number of states in the windy gridworld. In this case
     * the number of states equals to the number of tiles in the board.
     * @returns {number} the number of states in the world.
     */
    getNumberOfStates() {
        return Object.keys(this.stateMapping).length;
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

    getState() {
        let sum = 0;
        sum = this.plantEaterEaterN + this.plantN + this.plantEaterN;
        let l = Math.floor(100 * this.plantN / sum);
        let m = Math.floor(100 * this.plantEaterN / sum);
        let n = 100 - m - l;
        let key = l + "-" + m + "-" + n;
        let state = this.stateMapping[key];

        if(state == undefined) {
            debugger
        }

        return state;
    }

    initEnvironment() {
        this.world = new LifeLikeWorld(plan, {
                                              "#": Wall,
                                              "o": PlantEater,
                                              "$": PlantEaterEater,
                                              "*": Plant
                                              });

        reproduceLimits = {
                        "Plant" : 15,
                        "PlantEater" : 50,
                        "PlantEaterEater" : 50
                        };
    }

}

export { ElectronicLife as Environment, plan as map};

