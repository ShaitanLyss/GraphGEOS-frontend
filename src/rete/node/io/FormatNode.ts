import { getMessageFormatter, t } from "svelte-i18n";
import { Node, NodeParams } from "../Node";
import { capitalize } from "../../../utils/string";

export interface FormatNodeParams extends NodeParams {
    format?: string;
    vars?: Record<string, unknown>;
}

export class FormatNode extends Node {
    constructor({format="Hello {name}!", vars={name: "Lyss"}}: FormatNodeParams = {}) {
        super("Format", { height: 220 });
        this.addOutData({
            name: "result",
            displayName: "",})
        this.addInData({
            name: "format",
            displayName: "Format",
            socketLabel: "Format",
            type: "string",
            control: {
                type: "textarea",
                options: {
                    label: "Format",
                    initial: format,
                    change: (value) => {
                        this.updateDataInputs();
                        // console.log("ye");
                        
                    }
                }
            }
        })

        this.updateDataInputs(vars);
    }

    override data(inputs?: Record<string, unknown> | undefined): Record<string, unknown> | Promise<Record<string, unknown>> {
        return {result: undefined}
    }

    updateDataInputs(inputs?: Record<string, unknown>) {
        const formatString = this.getData<"text">("format", inputs);
        if (formatString) {
            getMessageFormatter(formatString).getAst()
            .filter((e) => e.type === 1)
            .map((e) => (e as unknown as {value: string}).value)
            .forEach((varName) => {
                const key = "data-" + varName;
                if (!(key in this.inputs)) {
                    const varData = this.getData(varName, inputs);
                    
                    this.addInData({
                        name: key,
                        displayName: capitalize(varName),
                        socketLabel: capitalize(varName),
                        control: {
                            type: "text",
                            options: {
                                label: capitalize(varName),
                                initial: varData,
                            }
                        }
                    });
                }
                
            });
        }
        console.log("yo");
        this.updateElement('node', this.id)
        
    }
}