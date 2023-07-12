import type { XmlProperty, XmlPropertyDefinition } from "./types";

export class XMLData {
    tag: string;
    name?: string;
    properties: Record<string, unknown>;
    children: XMLData[];

    constructor({ tag, name, properties, children }:
        {
            tag: string,
            name?: string,
            properties: Record<string, unknown>, children: XMLData[]
        }) {
        this.tag = tag;
        this.name = name;
        this.properties = properties;
        this.children = children;
    }

    toXml(): string {
        let xml = `<${this.tag}`;
        if (this.name)
            xml += ` name="${this.name}"`;

        Object.entries(this.properties).forEach(([name, value ]) => {
            const val = value instanceof Array ? `{ ${value.join(', ')} }`  : value;
            xml += ` ${name}="${val}"`;
        });
        if (this.children.length === 0)
            xml += '/>';
        else {
            xml += '>';
            this.children.forEach(child => {
                xml += child.toXml();
            });
            xml += `</${this.tag}>`;
        }
        return xml;
    }
}