import React from 'react';
import d3 from 'd3';
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
        <marker id={props.name} refX="3" refY="2" markerWidth="3" markerHeight="4" orient="auto"><path d="M 0,0 V 4 L3,2 Z"></path></marker>
    );
}

function SquareD3(props) {
    const factor = 0.9  * +props.size / 2;

    
     return (
        <g>
          <rect x={props.x} y={props.y} height={props.size} width={props.size} fill="#FFF" stroke="black" strokeWidth="2"></rect>
          <Arrow x1={+props.x + +props.size/2} y1={+props.y + +props.size/2} x2={+props.x + +props.size/2} y2={+props.y + +props.size/2 + factor} marker="url(#arrow)" visibility={+props.show[0] > 0 ? "visible":"hidden"}/> //DOWN
          <Arrow x1={+props.x + +props.size/2} y1={+props.y + +props.size/2} x2={+props.x + +props.size/2} y2={+props.y + +props.size/2 - factor} marker="url(#arrow)" visibility={+props.show[1] > 0 ? "visible":"hidden"}/> //UP
          <Arrow x1={+props.x + +props.size/2} y1={+props.y + +props.size/2} x2={+props.x + +props.size/2 - factor} y2={+props.y + +props.size/2} marker="url(#arrow)" visibility={+props.show[2] > 0 ? "visible":"hidden"}/> //LEFT
          <Arrow x1={+props.x + +props.size/2} y1={+props.y + +props.size/2} x2={+props.x + +props.size/2 + factor} y2={+props.y + +props.size/2} marker="url(#arrow)" visibility={+props.show[3] > 0 ? "visible":"hidden"}/> //RIGHT
        </g>
    );
}

function Arrow(props) { 
    return (
        <line x1={props.x1} y1={props.y1} x2={props.x2} y2={props.y2} stroke="black" strokeWidth="2" markerEnd={props.marker} visibility={props.visibility}></line>
    );
}



/**
 * Just a helper function that maps how are the elements in the board rendered.
 * @returns {Square} 
 */
function  getIcon(key){
    const emojis = {"o": "🤖", 
                    "%": "🍺"};
    return emojis[key];
}
function randomElement(array) 
{
  return array[Math.floor(Math.random() * array.length)];
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


    let squares = {};
    let arrows = {};
    let squareSize = 24;  // cell size
    let gh= 10; // height in cells
    let gw = 10; // width in cells
    let gs = gh * gw; // total number of cells
    let probabilities = new Array(gs * 4);
    
    function initGrid() {
      let container = d3.select('#draw');
      container.html('');
      squares = {};
      arrows = {};

      console.log("inside Init Grid");

      let w = 240;
      let h = 240;
      let svg = container.append('svg').attr('width', w).attr('height', h)
        .append('g').attr('transform', 'scale(1)');
      svg.append("defs").append("marker")
        .attr({
          "id":"arrow",
          "viewBox":"0 -5 10 10",
          "refX":5,
          "refY":0,
          "markerWidth":4,
          "markerHeight":4,
          "orient":"auto"
        })
        .append("path")
          .attr("d", "M0,-5L10,0L0,5")
          .attr("class","arrowHead");
      // define a marker for drawing arrowheads
      svg.append("defs").append("marker")
        .attr("id", "arrowhead")
        .attr("refX", 3)
        .attr("refY", 2)
        .attr("markerWidth", 3)
        .attr("markerHeight", 4)
        .attr("orient", "auto")
        .append("path")
          .attr("d", "M 0,0 V 4 L3,2 Z");

      for(let y=0;y<gh;y++) {
        for(let x=0;x<gw;x++) {
          let xcoord = x*squareSize;
          let ycoord = y*squareSize;
          let s = xytos(x,y);

          let g = svg.append('g');

          let r = g.append('rect')
            .attr('x', xcoord)
            .attr('y', ycoord)
            .attr('height', squareSize)
            .attr('width', squareSize)
            .attr('fill', '#FFF')
            .attr('stroke', 'black')
            .attr('stroke-width', 2);
          squares[s] = r;


          arrows[s] = [];
          let nx;
          let ny;
          for(let a=0; a<4; a++) {
            let ss = squareSize/2 * 0.7;
            if(a === 0) {
              let nx=-ss; 
              let ny=0;
            }
            if(a === 1) {
              let nx=0; 
              let ny=-ss;
            }
            if(a === 2) {
              let nx=0; 
              let ny=ss;
            }              
            if(a === 3) {
              let nx=ss; 
              let ny=0;
            }
            let pa = g.append('line')
              .attr('x1', xcoord+squareSize/2)
              .attr('y1', ycoord+squareSize/2)
              .attr('x2', xcoord+squareSize/2+nx)
              .attr('y2', ycoord+squareSize/2+ny)
              .attr('stroke', 'black')
              .attr('stroke-width', '2')
              .attr("marker-end", "url(#arrow)");
            arrows[s].push(pa);
          }
        }
      }
    }

    function xytos(x,y) {
        return x * gh + y ;
    }

    function repaint() {

      for(let y=0;y<gh;y++) {
        for(let x=0;x<gw;x++) {
          let xcoord = x*squareSize;
          let ycoord = y*squareSize;

          let s = xytos(x,y);

          let paa = arrows[s];
          for(let a=0;a<4;a++) {
            let pa = paa[a];
            let prob = probabilities[a*gs+s];
            if(prob === 0) { 
              pa.attr('visibility', 'hidden'); 
            }
            else { 
              pa.attr('visibility', 'visible'); 
            }

          }
        }
      }
    }

    function randomize() {
      for(let i=0;i< gs * 4;i++) {
        probabilities[i] = Math.random() < .5 ? 1 : 0;
      }
    }


export {Square, Row, Marker, SquareD3, Arrow, argMax, randomElement, initGrid};