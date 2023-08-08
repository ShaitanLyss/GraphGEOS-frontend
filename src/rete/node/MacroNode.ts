import type { NodeEditorSaveData } from "$rete/NodeEditor";
import { NodeEditor } from "$rete/NodeEditor";
import { Node } from "./Node";
import { NodeFactory } from "./NodeFactory";

export class MacroNode extends Node {
    static __isAbstract = true;

    readonly macroEditor: NodeEditor;
    readonly macroFactory: NodeFactory;

    constructor({ factory, saveData }: { factory: NodeFactory, saveData: NodeEditorSaveData }) {
        super({ factory, label: saveData.editorName, params: { saveData } });
        this.macroEditor = new NodeEditor()
        this.macroFactory = new NodeFactory({ editor: this.macroEditor, makutuClasses: factory.makutuClasses })
        this.initialize({ saveData });
        // Add marked inputs and outputs
    }

    async initialize({ saveData }: { saveData: NodeEditorSaveData }) {
        await this.macroFactory.loadGraph(saveData);
        for (const node of this.macroEditor.getNodes()) {

        }
    }
}