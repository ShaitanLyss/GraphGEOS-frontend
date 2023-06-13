import { InDataParams, Node, NodeParams, OutDataParams } from '../Node';
import type { XmlData, XmlProperty } from './types';
import { titlelize } from '../../../utils/string';
import type { InputControlTypes } from '../../control/Control';


type XmlNodeParams = NodeParams & {
    outData?: OutDataParams;
    xmlProperties?: XmlProperty[];
};

export abstract class XmlNode extends Node {
    static __isAbstract = true;
    static count = 0;
    name = "";


    constructor(name: string, config: XmlNodeParams) {
        XmlNode.count++;
        super(name, config);
        const { outData, xmlProperties } = config;

        if (xmlProperties)
            xmlProperties.forEach(({name, type, isArray}) => {
                this.addInData({
                    name:name,
                    displayName: titlelize(name),
                    socketLabel: titlelize(name),
                    type: type,
                    isArray: isArray,
                    control: {
                        type: type as InputControlTypes,
                    }
                });
            });

        if (outData)
            this.addOutData({
                name: 'value',
                displayName: outData.displayName,
                socketLabel: outData.socketLabel,
                type: outData.type,
            });
    }

    override data(inputs?: Record<string, unknown>): { "value": Record<string, unknown> } {
        const res: {"value": Record<string, unknown>} = { "value": {} };

        for (const key in inputs) {
            res["value"][key] = this.getData(key, inputs);
        }

        return res;
    }
}
