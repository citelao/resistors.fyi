import React, { KeyboardEvent } from "react";
import { calculate, IResistance, ResistorColor, supportedColors } from "./resistor";
import ResistorSvg from "./ResistorSvg";
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

function resistanceToString(resistance: IResistance): string {
    const numberString = `${resistance.sigFigs.shift()}.${resistance.sigFigs.join("")}`;
    return `${numberString}×${resistance.multiplier}Ω (±${resistance.tolerance}%)`
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

    private handleColorSelect = (color: ResistorColor | null, band: number) => {
        const supportedColors = getSupportedColorsForIndex(band);
        if (color && !supportedColors.includes(color)) {
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
            const selectHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
                const val = e.target.value as ResistorColor;
                this.handleColorSelect(val, i);
            };
            const unselectHandler = () => {
                this.handleColorSelect(null, i);
            };

            const isIndexChosen = this.state.colors.length > i && this.state.colors[i] != null;
            const indexSupportedColors = getSupportedColorsForIndex(i);

            // className={(isIndexChosen) ? " " : ""}
            return <fieldset key={i} className="mx-1">
                <legend className="py-6">Band #{i + 1}</legend>
                <ol>
                    {COLORS.map((c, j) => {
                        const isSupportedColor = indexSupportedColors.includes(c.label);
                        // const isSupportedColor = false;

                        const hotkey = HOTKEYS[j];
                        const shouldShowHotkeys = (this.state.currentIndex === i);

                        const isThisColorSelected = (isIndexChosen && c.label === this.state.colors[i]);

                        return <li key={c.label} className="text-lg">
                            <label className={
                                `block p-2 ${(isSupportedColor) ? "cursor-pointer" : ""} hover:bold hover:underline ${(isIndexChosen && !isThisColorSelected) ? "opacity-50 hover:opacity-100" : ""} ${(isSupportedColor) ? "" : "opacity-25"}`}
                                style={{ backgroundColor: c.background, color: c.color }}>
                                <input type="radio"
                                    onChange={selectHandler}
                                    name={radio_name}
                                    value={c.label}
                                    checked={isThisColorSelected}
                                    onClick={() => {
                                        if (isThisColorSelected) {
                                            console.log("foo")
                                            unselectHandler();
                                        }
                                    }}
                                    disabled={!isSupportedColor} />{" "}
                                {(!isSupportedColor) 
                                    ? <del>c.label</del>
                                    : c.label}
                                {(shouldShowHotkeys)
                                    ? <kbd className="float-right border border-solid border-white px-1 mx-1 font-mono rounded-sm">
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
                ? calculate([... this.state.colors].reverse() as ResistorColor[])
                : null;
        } catch(e) {
            invertedResistor = null;
        }

        return <>
            <section className="w-1/2 m-2">
                <h1>Reverse resistor calculator</h1>

                <div className="flex flex-wrap">
                    {form}
                </div>
            </section>

            <aside className="fixed top-0 right-0 m-2 w-1/2">
                <h2>Current state</h2>

                <ResistorSvg colors={this.state.colors}
                    length={150}
                    className="m-auto"/>

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
                        {resistanceToString(calculatedResistor)}
                    </p>
                    : null}

                {(invertedResistor)
                    ? <small>or{" "}
                        {resistanceToString(invertedResistor)}{" "}
                        if backwards

                        <ResistorSvg colors={[... this.state.colors].reverse()} 
                            length={60}
                            className="m-auto" />
                    </small>
                    : null}
            </aside>
        </>;
    }
}