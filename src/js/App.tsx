import React from "react";

const COLORS = [
    "black",
    "brown",
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "violet",
    "grey",
    "white",
    "gold",
    "silver",
    // "none"
];

export default class App extends React.Component {
    render() {
        return <>
            {COLORS.map((c) => <button key={c} className="colorButton">{c}</button>)}
        </>;
    }
}