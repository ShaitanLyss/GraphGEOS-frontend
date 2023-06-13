import { XmlNode } from './XmlNode';

export class FieldSpecificationNode extends XmlNode {
    constructor() {
        super('Field Specification', {
            outData: {
                name: 'fieldSpecification',
                displayName: 'Field Specification',
                type: 'fieldSpecification'
            },
            xmlProperties: [
                {
                    name: "objectPath",
                    type: "string"
                },
                {
                    name: "fieldName",
                    type: "string"
                },
                {
                    name: "scale",
                    type: "number"
                },
                {
                    name: "setNames",
                    type: "string",
                    isArray: true
                }
            ]
            });

            
    }
}
