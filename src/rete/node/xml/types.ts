import type { InputControlTypes } from "../../control/Control";
import type { SocketType } from "../../plugin/typed-sockets";

export type XmlData = {
    name: string;
}

type PropertyNames<T> = {
    [K in keyof T]: K;
}[keyof T];

export type XmlProperty = {
    name: string;
    type: SocketType;
    controlType?: InputControlTypes;
    isArray?: boolean;
}

