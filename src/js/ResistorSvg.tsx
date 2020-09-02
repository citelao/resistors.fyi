import React from "react";
import { ResistorColor } from "./resistor";

interface IResistorSvgProps {
    colors: Array<ResistorColor | null>;

    length?: number;
    rotate?: number;
    className?: string;
}

interface IResistorSvgState {
}

export default class ResistorSvg extends React.Component<IResistorSvgProps, IResistorSvgState> {
    public render() {
        const scale = (this.props.length || 80) / 80;
        const height = scale * 80;
        const width = scale * 32;
        
        // const rot = this.props.rotate || 0;
        // const DEGREES_PER_RADIAN = 360 / (2 * Math.PI);
        // const height = (rect_height * Math.cos(rot / DEGREES_PER_RADIAN)) +
        //     (rect_width * Math.sin(rot / DEGREES_PER_RADIAN));
        // const width = (rect_height * Math.sin(rot / DEGREES_PER_RADIAN)) +
        //     (rect_width * Math.cos(rot / DEGREES_PER_RADIAN));
        return <svg version="1"
            viewBox="0 0 32 80"
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            className={this.props.className}>
            <g transform={`rotate(${this.props.rotate || 0})`}>
                <path id="resistor_base" 
                    d="M3.3 14.17
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
                        L3.3 14.17Z"
                    fill="rgb(238 226 221)" />
                    {/* Lightened version of rgb(204, 168, 151) */}

                <mask id="resistor_mask">
                    <rect x="0" y="0"
                        width="100%" height="100%"
                        color="black" />

                    <use xlinkHref="#resistor_base" fill="white" />
                </mask>

                {this.props.colors.map((color, i) => {
                    if (!color) {
                        color = "white";
                    }

                    const Y_OFFSET = 7;
                    const HEIGHT = 7;
                    const SPACING = 2;

                    // 5th and 6th always have an offset. 4th only has an offset if
                    // there are only 4.
                    const isLast = this.props.colors.length - 1 === i;
                    const isOffset = (isLast)
                        ? (i >= 3)
                        : (i === 4);

                    const baseY = Y_OFFSET + ((HEIGHT + SPACING) * i);
                    const y = (isOffset)
                        ? baseY + 10
                        : baseY;

                    return <rect x="0" y={y}
                        width="32" height={HEIGHT}
                        fill={color} key={i} 
                        mask="url(#resistor_mask)" />;
                })}
            </g>
        </svg>;
    }
}