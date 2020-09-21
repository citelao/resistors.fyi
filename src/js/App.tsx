import React, { KeyboardEvent } from "react";
import Hotkey from "./Hotkey";
import { calculate, IResistance, ResistorColor, supportedColors } from "./resistor";
import ResistorSvg from "./ResistorSvg";
import { Colors } from "./resistor_colors";
import { from, repeat } from "./utils";

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
    history: Array<Array<ResistorColor | null>>,
    currentIndex: number
}

function isFullColors(cArray: Array<ResistorColor | null>): cArray is Array<ResistorColor> {
    const hasNull = cArray.findIndex((c) => c === null) !== -1;

    return !hasNull;
}

/// Trim any beginning or ending nulls.
function trimArray<T>(array: Array<T | null>): Array<T | null> {
    let startIndex = 0;
    while (array[startIndex] === null) {
        startIndex++;
    }

    let endIndex = array.length - 1;
    while (array[endIndex] === null) {
        endIndex--;
    }

    return array.slice(startIndex, endIndex + 1);
}

interface IPotentialResistors {
    normal: IResistance | null;
    reversed: IResistance | null;
}
function getPotentialResistors(colors: Array<ResistorColor | null>): IPotentialResistors {
    // Trim the array, since users may have deselected stuff.
    const trimmedColors = trimArray(colors);

    const isReadyToCalculate = (trimmedColors.length >= 3 && isFullColors(trimmedColors));
    if (!isReadyToCalculate) {
        return {
            normal: null,
            reversed: null
        };
    }

    let potentialNormal: IResistance | null = null;
    try {
        potentialNormal = calculate(trimmedColors as ResistorColor[]);
    } catch(e) {
        // Ignore errors, since not all resistors are valid.
    }

    let potentialReversed: IResistance | null = null;
    try {
        potentialReversed = calculate([... trimmedColors].reverse() as ResistorColor[]);
    } catch(e) {
        // Ignore errors, since not all resistors are valid.
    }

    return {
        normal: potentialNormal,
        reversed: potentialReversed
    };
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
            history: [],
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
        // console.log(e.key);
        
        if (e.key === "Enter") {
            // Handle the "new" key command
            // Check if we have any valid resistors:
            const potentialResistors = getPotentialResistors(this.state.colors);
            const hasPotentialResistors = !!(potentialResistors.normal || potentialResistors.reversed);
            if (hasPotentialResistors) {
                console.log(`Saving [${this.state.colors.join(", ")}]`);
                this.setState({
                    colors: [],
                    currentIndex: 0,
                    history: [... this.state.history, this.state.colors]
                });
            } else {
                console.warn(`Can't save resistor, invalid: [${this.state.colors.join(", ")}]`);
            }
            return;
        } else if (e.key === "r") {
            console.log(`Clearing [${this.state.colors.join(", ")}]`);
            this.setState({
                colors: [],
                currentIndex: 0,
            });
            return;
        }

        const hotkeyIndex = HOTKEYS.findIndex((h) => h === e.key);
        const wasHotkey = hotkeyIndex !== -1;
        if (!wasHotkey) {
            return;
        }

        if (this.state.currentIndex >= MAX_BANDS) {
            return;
        }

        const matchedColor = Colors[hotkeyIndex];

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
                    {Colors.map((c, j) => {
                        const isSupportedColor = indexSupportedColors.includes(c.label);
                        // const isSupportedColor = false;

                        const hotkey = HOTKEYS[j];
                        const shouldShowHotkeys = (this.state.currentIndex === i);

                        const isThisColorSelected = (isIndexChosen && c.label === this.state.colors[i]);

                        return <li key={c.label} className="text-lg">
                            <label className={
                                `block p-2 ${(isSupportedColor) ? "cursor-pointer hover:bold hover:underline transform hover:scale-110" : ""} ${(isIndexChosen && !isThisColorSelected) ? "opacity-50 hover:opacity-100" : ""} ${(isSupportedColor) ? "" : "opacity-25"}`}
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
                                    ? <del>{c.label}</del>
                                    : c.label}
                                {(shouldShowHotkeys)
                                    ? <Hotkey borderColor="light" className="float-right">
                                        {hotkey}
                                    </Hotkey>
                                    : null}
                            </label>
                        </li>;
                    })}
                </ol>
            </fieldset>;
        });

        const potentialResistors = getPotentialResistors(this.state.colors);
        const calculatedResistor = potentialResistors.normal;
        const invertedResistor = potentialResistors.reversed;

        return <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
                <section className="w-2/3 m-2">
                    <h1>resistors.fyi</h1>

                    <div className="flex flex-wrap">
                        {form}
                    </div>
                </section>

                <aside className="fixed top-0 right-0 bottom-0 overflow-x-scroll m-2 w-1/3">
                    <h2 className="text-center">Current state</h2>

                    <ResistorSvg colors={this.state.colors}
                        length={150}
                        className="m-auto"/>

                    <ol>
                        {this.state.colors.map((c) => {
                            if (!c) {
                                return <li>(unset)</li>;
                            }
                            const color = Colors.find((info) => info.label === c) ||
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

                    <ul className="m-auto">
                        <li><Hotkey>r</Hotkey> restart</li>
                        <li><Hotkey>enter</Hotkey> store &amp; create new</li>
                    </ul>

                    <h3 className="text-center my-2">History</h3>
                    {(this.state.history.length === 0)
                        ? <p className="text-center text-gray-600">(enter a resistor to save history)</p>
                        : null}
                    <ol className="list-decimal">
                        {this.state.history.map((h, i) => {
                            const potentialResistors = getPotentialResistors(h);
                            const calculatedResistor = potentialResistors.normal;
                            const invertedResistor = potentialResistors.reversed;

                            return <li key={i} className="grid grid-cols-3 even:bg-gray-200 p-1">
                                {(calculatedResistor)
                                    ? <>
                                        <ResistorSvg colors={h} length={30} />

                                        {/* Colors laid out */}
                                        <div className="flex">
                                            {h.map((c, j) => {
                                                const color = Colors.find((info) => info.label === c) ||
                                                    { background: "none", color: "inherit" };
                                                return <div
                                                    key={j}
                                                    className="w-4 h-4"
                                                    title={c || undefined}
                                                    style={{ backgroundColor: color.background, color: color.color }}>
                                                        {/* foo */}
                                                </div>;
                                            })}
                                        </div>
                                        <p>{resistanceToString(calculatedResistor)}</p>
                                    </>
                                    : null}

                                {(invertedResistor)
                                    ? <>
                                        <ResistorSvg colors={[...h].reverse()} length={20} />

                                        {/* Colors laid out */}
                                        <div className="flex">
                                            {[...h].reverse().map((c, j) => {
                                                const color = Colors.find((info) => info.label === c) ||
                                                    { background: "none", color: "inherit" };
                                                return <div
                                                    key={j}
                                                    className="w-4 h-2"
                                                    title={c || undefined}
                                                    style={{ backgroundColor: color.background, color: color.color }}>
                                                        {/* foo */}
                                                </div>;
                                            })}
                                        </div>

                                        <p className="text-sm">{resistanceToString(invertedResistor)}</p>
                                    </>
                                    : null}
                            </li>;
                        })}
                    </ol>
                </aside>
            </div>
            <footer className="text-center p-3 w-2/3">
                Written by <a href="https://ben.stolovitz.com/">Ben Stolovitz</a>. Licensed under the <a href="https://choosealicense.com/licenses/agpl-3.0/">GNU AGPLv3</a>. See it <a href="https://github.com/citelao/resistors.fyi">on GitHub</a>!
            </footer>
        </div>;
    }
}