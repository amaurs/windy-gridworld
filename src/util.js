import React from 'react';
/**
 * This function returns a React object that renders a tile of the board.
 * @returns {Square} 
 */
function Square(props) {
    return (
        <div>{props.value}</div>
    );
}
/**
 * This function returns a React object that renders a row of the board.
 * @returns {Square} 
 */
function Row(props) {
    return (
        <div>{props.row.map((square, index) => <Square key={index} value={getIcon(square)} />)}</div>
    );
}

function Marker(props) {
    return (
        <marker id={props.name} viewBox="0 -5 10 10" refX="5" refY="0" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,-5L10,0L0,5" className="arrowHead"></path></marker>
    );
}

function SquareD3(props) {
    const factor = 0.7 * +props.size / 2;

    
     return (
        <g>
          <rect className={props.className} x={props.x} y={props.y} height={props.size} width={props.size} fill="#fff" stroke="#eee" strokeWidth="1"></rect>
          <Arrow x1={+props.x + +props.size/2} y1={+props.y + +props.size/2} x2={+props.x + +props.size/2} y2={+props.y + +props.size/2 + factor} marker="url(#arrow)" visibility={+props.show[0] > 0 ? "visible":"hidden"}/> //DOWN
          <Arrow x1={+props.x + +props.size/2} y1={+props.y + +props.size/2} x2={+props.x + +props.size/2} y2={+props.y + +props.size/2 - factor} marker="url(#arrow)" visibility={+props.show[1] > 0 ? "visible":"hidden"}/> //UP
          <Arrow x1={+props.x + +props.size/2} y1={+props.y + +props.size/2} x2={+props.x + +props.size/2 - factor} y2={+props.y + +props.size/2} marker="url(#arrow)" visibility={+props.show[2] > 0 ? "visible":"hidden"}/> //LEFT
          <Arrow x1={+props.x + +props.size/2} y1={+props.y + +props.size/2} x2={+props.x + +props.size/2 + factor} y2={+props.y + +props.size/2} marker="url(#arrow)" visibility={+props.show[3] > 0 ? "visible":"hidden"}/> //RIGHT
        </g>
    );
}

function Arrow(props) { 
    return (
        <line x1={props.x1} y1={props.y1} x2={props.x2} y2={props.y2} stroke="#0C090D" strokeWidth="2" markerEnd={props.marker} visibility={props.visibility}></line>
    );
}



/**
 * Just a helper function that maps how are the elements in the board rendered.
 * @returns {Square} 
 */
function  getIcon(key){
    const emojis = {"o": "🤖", 
                    "#": "🌵" , 
                    "o": "🐑", 
                    "%": "🌹",
                    "*": "🌹",
                    "$": "🐯"  };
    return emojis[key];
}
function randomElement(array) 
{
  let result = array[Math.floor(Math.random() * array.length)];
  if(result==undefined){
            debugger
        }
  return result;
}  

function randomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


function argMax(array) {
    let argMaxArray = [];
    let max = Math.max.apply(null, array);
    for(let i = 0; i < array.length; i++) {
        if(max === array[i]) {
            argMaxArray.push(i);
        }
    }
    return argMaxArray;
}

export {Square, Row, Marker, SquareD3, Arrow, argMax, randomElement, randomInt};


