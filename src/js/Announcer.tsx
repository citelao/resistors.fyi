import React from "react";

export class Announce {
    private static readonly instance: Announce = new Announce();

    // Use `get` instead.
    private constructor() {
        // no-op
    }

    public static get(): Announce {
        return Announce.instance;
    }

    private announcer: Announcer | null = null;

    public announce(str: string): void {
        if (!this.announcer) {
            throw new Error("No Announcer registered.");
        }

        console.log(`Announcing: "${str}"`);
        this.announcer.announce(str);
    }

    public register(an: Announcer) {
        this.announcer = an;
    }

    public unregister(an: Announcer) {
        if (this.announcer !== an) {
            throw new Error("Trying to unregister an unregistered announcer");
        }

        this.announcer = null;
    }
}

interface IAnnouncerProps {
}

interface IAnnouncerState {
    message1: string;
    message2: string;
    lastMessage: "1" | "2";
}

export default class Announcer extends React.Component<IAnnouncerProps, IAnnouncerState> {
    public constructor(props: IAnnouncerProps) {
        super(props);

        this.state = {
            message1: "",
            message2: "",
            lastMessage: "1"
        }
    }
    public componentDidMount() {
        Announce.get().register(this);
    }

    public componentWillUnmount() {
        Announce.get().unregister(this);
    }

    public announce(str: string) {
        if (this.state.lastMessage === "1") {
            this.setState({
                message1: "",
                message2: str,
                lastMessage: "2"
            });
        } else {
            this.setState({
                message1: str,
                message2: "",
                lastMessage: "1"
            });
        }
    }

    public render() {
        const CLASSES = "sr-only";
        return <>
            <div className={CLASSES}
                aria-live="assertive"
                aria-atomic="true">
                {this.state.message1}
            </div>
            <div className={CLASSES}
                aria-live="assertive"
                aria-atomic="true">
                {this.state.message2}
            </div>
        </>;
    }
}