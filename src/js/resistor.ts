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

export type ResistorMultiplier = string;
export type ResistorTolerance = string;
const DEFAULT_TOLERANCE = "20";

interface IResistorColorInfo {
    sigFig: number | null,
    multiplier: ResistorMultiplier;
    tolerance: ResistorTolerance | null;
}
const RAW_COLOR_MAP = [
    [ "black",	{ sigFig: 0,	multiplier: "1",	tolerance: null } ],
    [ "brown",	{ sigFig: 1,	multiplier: "10",	tolerance: "1" } ],
    [ "red",	{ sigFig: 2,	multiplier: "100",	tolerance: "2" } ],
    [ "orange",	{ sigFig: 3,	multiplier: "1K",	tolerance: null } ],
    [ "yellow",	{ sigFig: 4,	multiplier: "10K",	tolerance: null } ],
    [ "green",	{ sigFig: 5,	multiplier: "100K",	tolerance: "0.5" } ],
    [ "blue",	{ sigFig: 6,	multiplier: "1M",	tolerance: "0.25" } ],
    [ "violet",	{ sigFig: 7,	multiplier: "10M",	tolerance: "0.1" } ],
    [ "grey",	{ sigFig: 8,	multiplier: "100M",	tolerance: "0.05" } ],
    [ "white",	{ sigFig: 9,	multiplier: "1G",	tolerance: null } ],

    [ "gold",	{ sigFig: null,	multiplier: "0.1",	tolerance: "5" } ],
    [ "silver",	{ sigFig: null,	multiplier: "0.01",	tolerance: "10" } ],
    // "none"
];
const COLOR_MAP: Map<ResistorColor, IResistorColorInfo> = new Map(RAW_COLOR_MAP);

function getMatchingColors(fn: (color: ResistorColor, info: IResistorColorInfo) => boolean): ResistorColor[] {
    const colors: ResistorColor[] = RAW_COLOR_MAP.filter((arr) => {
        return fn(arr[0] as any, arr[1] as any);
    }).map((arr) => {
        return arr[0] as ResistorColor;
    });

    return colors;
}

export function supportedColors(size: number): Array<Array<ResistorColor>> {
    const sigFigColors = getMatchingColors((color, info) => {
        return info.sigFig !== null;
    });
    const multiplierColors = getMatchingColors((color, info) => {
        // Yes it's all of them.
        return info.multiplier !== null;
    });
    const toleranceColors = getMatchingColors((color, info) => {
        return info.tolerance !== null;
    });

    switch(size) {
    case 3:
        return [
            sigFigColors,
            sigFigColors,
            multiplierColors
        ];
    case 4:
        return [
            sigFigColors,
            sigFigColors,
            multiplierColors,
            toleranceColors
        ];
    case 5:
        return [
            sigFigColors,
            sigFigColors,
            sigFigColors,
            multiplierColors,
            toleranceColors
        ];
    case 6:
        throw new Error("Not implemented");
    }

    throw new Error(`Invalid number ${size}`);
}

export interface IResistance {
    sigFigs: number[]
    multiplier: ResistorMultiplier,
    tolerance: ResistorTolerance,
    temperatureCoefficient?: "TODO",
    failRate?: "TODO",
}

// function hasSigFig(color: ResistorColor): boolean {
//     if (!COLOR_MAP.has(color)) {
//         throw new Error(`Invalid color ${color}.`);
//     }

//     const sigFig = COLOR_MAP.get(color);
//     const hasSigFig = null != sigFig;

//     return hasSigFig;
// }

function getSigFig(color: ResistorColor): number {
    if (!COLOR_MAP.has(color)) {
        throw new Error(`Invalid color ${color}.`);
    }

    const sigFig = COLOR_MAP.get(color)?.sigFig;
    if (null == sigFig) {
        throw new Error(`Color ${color} does not have a sig fig.`);
    }

    return sigFig;
}

function getMultiplier(color: ResistorColor): ResistorMultiplier {
    if (!COLOR_MAP.has(color)) {
        throw new Error(`Invalid color ${color}.`);
    }

    const multiplier = COLOR_MAP.get(color)?.multiplier;
    if (null == multiplier) {
        throw new Error(`Color ${color} does not have a multiplier.`);
    }

    return multiplier;
}

function getTolerance(color: ResistorColor): ResistorTolerance {
    if (!COLOR_MAP.has(color)) {
        throw new Error(`Invalid color ${color}.`);
    }

    const tolerance = COLOR_MAP.get(color)?.tolerance;
    if (null == tolerance) {
        throw new Error(`Color ${color} does not have a tolerance.`);
    }

    return tolerance;
}

export function calculate(colors: ResistorColor[]): IResistance {
    if (colors.length < 3 || colors.length > 6) {
        throw new Error(`Invalid number of colors (${colors.length}, should be 3-6)`);
    }

    // Otherwise 2 sigfigs.
    const hasThreeSigFigs = (colors.length >= 5);

    const sigFigs = (hasThreeSigFigs)
        ? [ getSigFig(colors[0]), getSigFig(colors[1]), getSigFig(colors[2]) ]
        : [ getSigFig(colors[0]), getSigFig(colors[1]) ];

    const multiplierIndex = (hasThreeSigFigs)
        ? 3
        : 2;
    const multiplier = getMultiplier(colors[multiplierIndex]);

    let tolerance: ResistorTolerance;
    if (colors.length > 3) {
        const toleranceIndex = multiplierIndex + 1;
        tolerance = getTolerance(colors[toleranceIndex]);
    } else {
        tolerance = DEFAULT_TOLERANCE;
    }

    if (colors.length > 5) {
        // TODO: temp coefficient & failure rate.
        throw new Error("Not implemented");
    }

    return {
        sigFigs: sigFigs,
        multiplier: multiplier,
        tolerance: tolerance
    };
}