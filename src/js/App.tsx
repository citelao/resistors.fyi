import React, { KeyboardEvent } from "react";
import { calculate, IResistance, ResistorColor, supportedColors } from "./resistor";
import { from, repeat } from "./utils";

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
// TODO 6
// const MAX_BANDS = 3;
const MAX_BANDS = 5;

const HOTKEYS = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "a",
    "b",
];

interface IAppProps {
}

interface IAppState {
    colors: Array<ResistorColor | null>,
    currentIndex: number
}

function isFullColors(cArray: Array<ResistorColor | null>): cArray is Array<ResistorColor> {
    const hasNull = cArray.findIndex((c) => c === null) !== -1;

    return !hasNull;
}

const SUPPORTED_COLORS_ARR = from(3, MAX_BANDS, (i) => {
    return supportedColors(i);
});
function getSupportedColorsForIndex(index: number): ResistorColor[] {
    const indexSupportedColors = SUPPORTED_COLORS_ARR.reduce<ResistorColor[]>((acc, supportedColorsForBand) => {
        const colorsForIndex = (supportedColorsForBand.length > index)
            ? supportedColorsForBand[index]
            : [];
        return [...acc, ...colorsForIndex];
    }, [])
        .sort()
        .filter((color, index, self) => {
            // Only keep the first one.
            return self.indexOf(color) === index;
        });

    return indexSupportedColors;
}

export default class App extends React.Component<IAppProps, IAppState> {
    constructor(props: IAppProps) {
        super(props);

        this.state = {
            colors: [],
            currentIndex: 0
        };
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown, false);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown, false);
    }

    private handleKeyDown = (e: globalThis.KeyboardEvent): void => {
        const hotkeyIndex = HOTKEYS.findIndex((h) => h === e.key);
        const wasHotkey = hotkeyIndex !== -1;
        if (!wasHotkey) {
            return;
        }

        if (this.state.currentIndex >= MAX_BANDS) {
            return;
        }

        const matchedColor = COLORS[hotkeyIndex];

        this.handleColorSelect(matchedColor.label, this.state.currentIndex);
    }

    private handleColorSelect = (color: ResistorColor, band: number) => {
        const supportedColors = getSupportedColorsForIndex(band);
        if (!supportedColors.includes(color)) {
            console.warn(`Color not supported for this band (${color}, ${band})`);
            return;
        }

        const nullsToGenerate = Math.max(0, (band - this.state.colors.length));
        const colors = [... this.state.colors, ... repeat(nullsToGenerate, () => null)];
        colors[band] = color;

        const shouldIncrementIndex = (this.state.currentIndex === band);

        this.setState({
            colors: colors,
            currentIndex: (shouldIncrementIndex)
                ? this.state.currentIndex + 1
                : this.state.currentIndex
        });
    }

    render() {
        const form = repeat(MAX_BANDS, (i) => {
            const radio_name = `band${i}`;
            const handler = (e: React.ChangeEvent<HTMLInputElement>) => {
                const val = e.target.value as ResistorColor;
                this.handleColorSelect(val, i);
            };

            const isIndexChosen = this.state.colors.length > i && this.state.colors[i] != null;
            const indexSupportedColors = getSupportedColorsForIndex(i);

            return <fieldset key={i}>
                <legend className="p-6">Band #{i + 1}</legend>
                <ol>
                    {COLORS.map((c, j) => {
                        const isSupportedColor = indexSupportedColors.includes(c.label);
                        // const isSupportedColor = false;

                        const hotkey = HOTKEYS[j];
                        const shouldShowHotkeys = (this.state.currentIndex === i);

                        const isThisColorSelected = (isIndexChosen && c.label === this.state.colors[i]);

                        return <li key={c.label} className="text-lg">
                            <label className={
                                `block p-2 cursor-pointer hover:bold hover:underline ${(isIndexChosen && !isThisColorSelected) ? "opacity-50 hover:opacity-100" : ""} ${(isSupportedColor) ? "" : "opacity-25"}`}
                                style={{ backgroundColor: c.background, color: c.color }}>
                                <input type="radio"
                                    onChange={handler}
                                    name={radio_name}
                                    value={c.label}
                                    disabled={!isSupportedColor} />{" "}
                                {c.label}
                                {(shouldShowHotkeys)
                                    ? <kbd className="float-right border border-solid border-white p-1 py-0 font-mono rounded-sm">
                                        {hotkey}
                                    </kbd>
                                    : null}
                            </label>
                        </li>;
                    })}
                </ol>
            </fieldset>;
        });

        const isReadyToCalculate = (this.state.colors.length >= 3 && isFullColors(this.state.colors));
        let calculatedResistor: IResistance | null;
        try {
            calculatedResistor = (isReadyToCalculate)
                ? calculate(this.state.colors as ResistorColor[])
                : null;
        } catch(e) {
            calculatedResistor = null;
        }

        let invertedResistor: IResistance | null;
        try {
            invertedResistor = (isReadyToCalculate)
                ? calculate(this.state.colors.reverse() as ResistorColor[])
                : null;
        } catch(e) {
            invertedResistor = null;
        }

        return <>
            <section className="w-1/2 m-2">
                <h1>Reverse resistor calculator</h1>

                {form}
            </section>

            <aside className="fixed top-0 right-0 m-2">
                <h2>Current state</h2>
                <svg version="1"
                    viewBox="0 0 32 80"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.3 14.17
                        L2.77 13.2
                        L2.35 12.28
                        L2.04 11.41
                        L1.83 10.58
                        L1.73 9.8
                        L1.73 9.07
                        L1.85 8.28
                        L2.11 7.44
                        L2.56 6.58
                        L3.24 5.73
                        L4.18 4.92
                        L5.42 4.17
                        L7.01 3.52
                        L8.99 3
                        L11.39 2.64
                        L14.26 2.46
                        L16.17 2.49
                        L18.09 2.46
                        L20.96 2.64
                        L23.36 3
                        L25.34 3.52
                        L26.93 4.17
                        L28.17 4.92
                        L29.11 5.73
                        L29.79 6.58
                        L30.24 7.44
                        L30.5 8.28
                        L30.62 9.07
                        L30.62 9.8
                        L30.52 10.58
                        L30.31 11.41
                        L30 12.28
                        L29.57 13.2
                        L29.05 14.17
                        L28.42 15.19
                        L27.68 16.25
                        L26.83 17.37
                        L25.88 18.53
                        L24.82 19.73
                        L24.82 47.91
                        L25.88 49.11
                        L26.83 50.27
                        L27.68 51.38
                        L28.42 52.45
                        L29.05 53.46
                        L29.57 54.43
                        L30 55.36
                        L30.31 56.23
                        L30.52 57.06
                        L30.62 57.84
                        L30.62 58.57
                        L30.5 59.36
                        L30.24 60.19
                        L29.79 61.06
                        L29.11 61.91
                        L28.17 62.72
                        L26.93 63.47
                        L25.34 64.12
                        L23.36 64.64
                        L20.96 65
                        L18.09 65.17
                        L16.17 65.15
                        L14.26 65.17
                        L11.39 65
                        L8.99 64.64
                        L7.01 64.12
                        L5.42 63.47
                        L4.18 62.72
                        L3.24 61.91
                        L2.56 61.06
                        L2.11 60.19
                        L1.85 59.36
                        L1.73 58.57
                        L1.73 57.84
                        L1.83 57.06
                        L2.04 56.23
                        L2.35 55.36
                        L2.77 54.43
                        L3.3 53.46
                        L3.93 52.45
                        L4.67 51.38
                        L5.52 50.27
                        L6.47 49.11
                        L7.52 47.91
                        L7.52 19.73
                        L6.47 18.53
                        L5.52 17.37
                        L4.67 16.25
                        L3.93 15.19
                        L3.93 15.19
                        L3.3 14.17Z" id="resistor base"/>

                    <rect x="0" y="7"
                        width="32" height="8"
                        fill="red" />
                    
                    <rect x="0" y="17"
                        width="32" height="8"
                        fill="blue" />
                    
                    <rect x="0" y="27"
                        width="32" height="8"
                        fill="green" />

                    {/* top */}
                    {/* <rect x="0" y="0"
                        width="30" height="10"
                        rx="4" ry="4" /> */}

                    {/* bottom */}
                    {/* <rect x="0" y="40"
                        width="30" height="10" /> */}
                </svg>

                <ol>
                    {this.state.colors.map((c) => {
                        if (!c) {
                            return <li>(unset)</li>;
                        }
                        const color = COLORS.find((info) => info.label === c) ||
                            { background: "none", color: "inherit" };
                        return <li style={{ backgroundColor: color.background, color: color.color }}>{c}</li>;
                    })}
                </ol>

                {(calculatedResistor)
                    ? <p>
                        {calculatedResistor.sigFigs}{" "}
                        x {calculatedResistor.multiplier}Ω{" "}
                        ({calculatedResistor.tolerance}%)
                    </p>
                    : null}

                {(invertedResistor)
                    ? <small>or{" "}
                        {invertedResistor.sigFigs}{" "}
                        x {invertedResistor.multiplier}Ω{" "}
                        ({invertedResistor.tolerance}%){" "}
                        if backwards
                    </small>
                    : null}
            </aside>
        </>;
    }
}