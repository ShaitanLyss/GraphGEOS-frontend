import type { AreaPlugin } from "rete-area-plugin";
import type { NodeEditor } from "../NodeEditor";
import type { AreaExtra } from "./AreaExtra";
import type { Schemes } from "./Schemes";
import { ControlFlowEngine, DataflowEngine } from "rete-engine";
import { ExecSocket } from "../socket/ExecSocket";
import { structures } from "rete-structures";
import { Node } from "./Node";

function createDataflowEngine() {
    return new DataflowEngine<Schemes>(({ inputs, outputs }) => {
        return {
            inputs: () =>
                Object.entries(inputs)
                    .filter(([_, input]) => input && !(input.socket instanceof ExecSocket))
                    .map(([name]) => name),
            outputs: () =>
                Object.entries(outputs)
                    .filter(([_, output]) => output && !(output.socket instanceof ExecSocket))
                    .map(([name]) => name)
        };
    });
}

function createControlflowEngine() {
    return new ControlFlowEngine<Schemes>(({ inputs, outputs }) => {
        return {
            inputs: () =>
                Object.entries(inputs)
                    .filter(([_, input]) => input && input.socket instanceof ExecSocket)
                    .map(([name]) => name),
            outputs: () =>
                Object.entries(outputs)
                    .filter(([_, output]) => output && output.socket instanceof ExecSocket)
                    .map(([name]) => name)
        };
    });
}

export class NodeFactory {
    private area: AreaPlugin<Schemes, AreaExtra>;
    private editor: NodeEditor;
    
    public readonly dataflowEngine = createDataflowEngine();
    private readonly controlflowEngine = createControlflowEngine();

    constructor(editor: NodeEditor, area: AreaPlugin<Schemes, AreaExtra>) {
        this.area = area;
        this.editor = editor;
        editor.use(this.dataflowEngine);
        editor.use(this.controlflowEngine);
    }

    enable() {
        Node.activeFactory = this;
    }

    disable() {
        Node.activeFactory = undefined;
    }

    create<T extends Node>(type: (new () => T)): T {
        return new type();
    }

    getEditor(): NodeEditor {
        return this.editor;
    }

    getControlFlowEngine(): ControlFlowEngine<Schemes> {
        return this.controlflowEngine;
    }

    getArea(): AreaPlugin<Schemes, AreaExtra> {
        return this.area;
    }
    

    resetSuccessors(node: Node) {
        structures(this.editor)
            .successors(node.id)
            .nodes()
            .forEach((n) => this.dataflowEngine.reset(n.id));
    }

    process(node?: Node) {
        if (node) {
            this.dataflowEngine.reset(node.id);
            this.resetSuccessors(node);
        }
        // dataflowEngine.reset();
        this.editor
            .getNodes()
            // .filter((n) => n instanceof AddNode || n instanceof DisplayNode)
            .forEach((n) => this.dataflowEngine.fetch(n.id));
    }
}