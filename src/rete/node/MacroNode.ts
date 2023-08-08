import { GetGraphStore } from "$houdini";
import { Input, Node, NodeFactory, NodeEditor, Socket, Output } from "$rete";
import type { NodeEditorSaveData } from "$rete/NodeEditor";
import type { InputControl } from "$rete/control/Control";
import { ExecSocket } from "$rete/socket/ExecSocket";
import type { UUID } from "crypto";

export class MacroNode extends Node {

    readonly macroEditor: NodeEditor;
    readonly macroFactory: NodeFactory;

    graphId: UUID;

    constructor({ factory, saveData, graphId }: { factory: NodeFactory, saveData: NodeEditorSaveData, graphId: UUID }) {
        super({ factory, params: { saveData, graphId }, height: 25 });
        this.graphId = graphId;
        this.macroEditor = new NodeEditor()
        this.macroFactory = new NodeFactory({ editor: this.macroEditor, makutuClasses: factory.makutuClasses })
        let numSockets = 0;
        for (const node of saveData.nodes) {
            numSockets += node.selectedInputs.length + node.selectedOutputs.length;
        }
        this.height += numSockets * 55;

        this.initializePromise = this.initialize({ graphId })
        // this.afterInitialize = () => {
        //     console.log("MacroNode.afterInitialize")
        //     let numSockets = 0;
        //     for (const node of this.macroEditor.getNodes()) {
        //         numSockets += Object.keys(node.socketSelectionComponent.selectedInputs()).length + Object.keys(node.socketSelectionComponent.selectedOutputs()).length;
        //     }
        //     this.height += numSockets * 55;
        //     this.updateElement();
        // }

    }

    async initialize(params: { graphId: UUID }): Promise<void> {
        const { graphId } = params;
        const data = (await new GetGraphStore().fetch({ variables: { id: graphId } })).data?.graph.data;
        if (data === undefined) throw new Error("Graph not found : " + graphId);
        const saveData: NodeEditorSaveData = JSON.parse(data);
        this.label = saveData.editorName;
        await this.macroFactory.loadGraph(saveData);
        for (const node of this.macroEditor.getNodes()) {
            for (const [key, input] of Object.entries(node.socketSelectionComponent.selectedInputs())) {
                if (input.socket instanceof ExecSocket) {
                    this.addInExec(key + "-" + node.id, input.socket.name)
                    continue;
                }
                const macroInput = this.addInData({
                    name: key + "-" + node.id,
                    displayName: input.socket.name,
                    type: input.socket.type,
                    isArray: input.socket.isArray,
                    isRequired: input.socket.isRequired,
                    socketLabel: input.socket.name,
                })
                macroInput.control = input.control;
            }
            for (const [key, output] of Object.entries(node.socketSelectionComponent.selectedOutputs())) {
                this.addOutput(key + "-" + node.id, new Output(new (output.socket.constructor as typeof Socket)({

                    ...output.socket,
                    node: this,
                })))
            }
        }
        this.updateElement();
    }

    override execute(input: string, forward: (output: string) => unknown, forwardExec?: boolean): void {
        const [key, nodeId] = input.split("-");
        this.macroFactory.getControlFlowEngine().execute(nodeId, key)
    }

}