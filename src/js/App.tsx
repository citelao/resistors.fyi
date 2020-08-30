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
            <h1>Reverse resistor calculator</h1>
            <p>What's the first color on your resistor? The side you choose doesn't matter.</p>
            
            <fieldset>
                <legend>Color</legend>
                <ol>
                    {COLORS.map((c) => {
                        return <li key={c} className="colorButton">
                            <label>
                                <input type="radio" name="foo"/> {c}
                            </label>
                        </li>;
                    })}
                </ol>
            </fieldset>
        </>;
    }
}