import type { NodeFactory } from "$rete/node/NodeFactory";
import { XmlNode } from "../XmlNode";


export class FiniteElementsNode extends XmlNode {
    constructor({ factory }: { factory: NodeFactory }) {
        super({
            label: 'FiniteElements', factory, xmlConfig: {
            xmlTag: "FiniteElements",
            noName: true,
            outData: {
                type: 'numericalMethod',
                name: 'FiniteElements',
                displayName: 'FiniteElements',
                socketLabel: 'FiniteElements',
            },
    }})

        this.addXmlInData({
            type: 'any',
            name: 'finiteElements',
            // tag: 'FiniteElements',
            isArray: true,
        })
    }
}