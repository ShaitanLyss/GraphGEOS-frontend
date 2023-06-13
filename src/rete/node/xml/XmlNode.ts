import { InDataParams, Node, NodeParams, OutDataParams } from '../Node';
import type { XmlData, XmlProperty } from './types';
import { titlelize } from '../../../utils/string';
import type { InputControlTypes } from '../../control/Control';


type XmlNodeParams = NodeParams & {
    outData?: OutDataParams;
    initialValues?: Record<string, unknown>;
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
        let { initialValues } = config;
        initialValues = initialValues !==  undefined ? initialValues : {};

        if (xmlProperties)
            xmlProperties.forEach(({name, type, isArray, controlType}) => {
                this.addInData({
                    name:name,
                    displayName: titlelize(name),
                    socketLabel: titlelize(name),
                    type: type,
                    isArray: isArray,
                    control: controlType && {
                        type: controlType,
                        options: {
                            label: titlelize(name),
                            initial: initialValues[name],
                        },
                    }
                });
            });

        if (outData)
            this.addOutData({
                name: 'value',
                displayName: "",
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
