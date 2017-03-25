import React from 'react';
function Square(props) {
    return (
        <div>{props.value}</div>
    );
}
function Row(props) {
    return (
        <div>{props.row.map((square, index) => <Square key={index} value={getIcon(square)} />)}</div>
    );
}
function  getIcon(key){
    const emojis = {"o": "🤖", 
                    "%": "🍺"};
    return emojis[key];
}

export {Square, Row};