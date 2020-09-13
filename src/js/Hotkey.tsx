import React from "react";

interface IHotkeyProps {
    className?: string;
    children?: React.ReactNode;
    borderColor?: "light" | "dark";
}

export default class Hotkey extends React.Component<IHotkeyProps> {
    public render() {
        const BASE_CLASSES = "border border-solid px-1 mx-1 font-mono rounded-sm";

        const LIGHT_CLASSES = "border-white";
        const DARK_CLASSES = "border-black";
        const mode_classes = (this.props.borderColor === "light")
            ? LIGHT_CLASSES
            : DARK_CLASSES;

        const classes = `${BASE_CLASSES} ${mode_classes} ${this.props.className}`;
        return <kbd className={classes}>
            {this.props.children}
        </kbd>;
    }
}