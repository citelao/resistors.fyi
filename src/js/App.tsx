import React from "react";
import { calculate, ResistorColor } from "./resistor";
import { repeat } from "./utils";

type ResistorColorInfo = {
    label: ResistorColor,
    background: string;
    color: string;
};
const COLORS: ResistorColorInfo[] = [
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
];

interface IAppProps {
}

interface IAppState {
    colors: Array<ResistorColor | null>
}

function isFullColors(cArray: Array<ResistorColor | null>): cArray is Array<ResistorColor> {
    const hasNull = cArray.findIndex((c) => c === null) !== -1;

    return !hasNull;
}

export default class App extends React.Component<IAppProps, IAppState> {
    constructor(props: IAppProps) {
        super(props);

        this.state = {
            colors: [],
        };
    }

    render() {
        // TODO 6
        const MAX_BANDS = 5;
        // const MAX_BANDS = 3;
        const form = repeat(MAX_BANDS, (i) => {
            const radio_name = `band${i}`;
            const handler = (e: React.ChangeEvent<HTMLInputElement>) => {
                const val = e.target.value as ResistorColor;

                const nullsToGenerate = Math.max(0, (i - this.state.colors.length));
                const colors = [... this.state.colors, ... repeat(nullsToGenerate, () => null)];
                colors[i] = val;
                this.setState({
                    colors: colors
                });
            };

            const isIndexChosen = this.state.colors.length > i && this.state.colors[i] != null;

            return <fieldset key={i}>
                <legend className="p-6">Band #{i + 1}</legend>
                <ol>
                    {COLORS.map((c) => {
                        const isColor = (isIndexChosen && c.label === this.state.colors[i]);
                        return <li key={c.label} className="text-lg">
                            <label className={`block p-2 hover:bold hover:underline ${(isIndexChosen && !isColor) ? "opacity-50 hover:opacity-100" : ""}`} style={{ backgroundColor: c.background, color: c.color }}>
                                <input type="radio" onChange={handler} name={radio_name} value={c.label} /> {c.label}
                            </label>
                        </li>;
                    })}
                </ol>
            </fieldset>;
        });

        const isReadyToCalculate = (this.state.colors.length >= 3 && isFullColors(this.state.colors));
        const calculatedResistor = (isReadyToCalculate)
            ? calculate(this.state.colors as ResistorColor[])
            : null;

        return <>
            <h1>Reverse resistor calculator</h1>
            <p>What's the first color on your resistor? The side you choose doesn't matter.</p>

            {form}

            <aside className="fixed top-0 right-0 m-2">
                <h2>Current state</h2>
                <ol>
                    {this.state.colors.map((c) => {
                        if (!c) {
                            return <li>hi</li>;
                        }
                        const color = COLORS.find((info) => info.label === c) ||
                            { background: "none", color: "inherit" };
                        return <li style={{ backgroundColor: color.background, color: color.color }}>{c}</li>;
                    })}
                </ol>

                {(calculatedResistor)
                    ? <>
                        {calculatedResistor.sigFigs}{" "}
                        x {calculatedResistor.multiplier}{" "}
                        ({calculatedResistor.tolerance}%)
                    </>
                    : null}
            </aside>
        </>;
    }
}