import React from "react";

const COLORS = [
    { label: "black", background: "#000", color: "#fff" },
    { label: "brown", background: "#524526", color: "#fff" },
    { label: "red", background: "#ba062d", color: "#fff" },
    { label: "orange", background: "rgb(231, 73, 22)", color: "#fff" },
    { label: "yellow", background: "rgb(246, 193, 10)", color: "#000" },
    { label: "green", background: "rgb(23, 100, 64)", color: "#fff" },
    { label: "blue", background: "rgb(73, 63, 159)", color: "#fff" },
    { label: "violet", background: "rgb(165, 85, 143)", color: "#000" },
    { label: "grey", background: "#777", color: "#fff" },
    { label: "white", background: "#fff", color: "#000" },
    
    // TODO: prettify
    { label: "gold", background: "rgb(211, 172, 132)", color: "#000" },
    { label: "silver", background: "rgb(163, 157, 146)", color: "#000" },
    // "none"
];

export default class App extends React.Component {
    render() {
        return <>
            <h1>Reverse resistor calculator</h1>
            <p>What's the first color on your resistor? The side you choose doesn't matter.</p>
            
            <fieldset>
                <legend>Color</legend>
                <ol className="color_list">
                    {COLORS.map((c) => {
                        return <li key={c.label} className="color_button color_list__item">
                            <label className="color_button__label" style={{ background: c.background, color: c.color }}>
                                <input type="radio" name="TODO" value={c.label} /> {c.label}
                            </label>
                        </li>;
                    })}
                </ol>
            </fieldset>
        </>;
    }
}