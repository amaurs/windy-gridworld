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
/**
 * Just a helper function that maps how are the elements in the board rendered.
 * @returns {Square} 
 */
function  getIcon(key){
    const emojis = {"o": "🤖", 
                    "%": "🍺"};
    return emojis[key];
}

export {Square, Row};