export type ResistorColor = "black" |
    "brown" |
    "red" |
    "orange" |
    "yellow" |
    "green" |
    "blue" |
    "violet" |
    "grey" |
    "white" |
    "gold" |
    "silver";

interface IResistance {
    sigFigs: number[]
    multiplier: number,
    tolerance?: "todo",
    temperatureCoefficient?: "TODO",
    failRate?: "TODO",
}

export function calculate(colors: ResistorColor[]): IResistance {
    throw new Error("Not implemented");
}