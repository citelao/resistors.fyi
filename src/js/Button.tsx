import React from "react";

interface IButtonProps {
    className?: string;
    children?: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    // borderColor?: "light" | "dark";
}

export default class Button extends React.Component<IButtonProps> {
    public render() {
        const BASE_CLASSES = "p-1 bg-red-500 rounded-sm transform hover:scale-110 focus:scale-110 active:translate-y-1";

        const classes = `${BASE_CLASSES} ${this.props.className || ""}`;
        return <button className={classes} onClick={this.props.onClick || undefined}>
            {this.props.children}
        </button>;
    }
}