import { AreaExtensions, AreaPlugin } from 'rete-area-plugin';
import type { NodeEditor, NodeEditorSaveData } from '../NodeEditor';
import type { AreaExtra } from './AreaExtra';
import type { Schemes } from './Schemes';
import { ControlFlowEngine, DataflowEngine } from 'rete-engine';
import { ExecSocket } from '../socket/ExecSocket';
import { structures } from 'rete-structures';
import { Connection, Node } from './Node';
import { ClassicPreset } from 'rete';
import { InputControl } from '$rete/control/Control';
import { Writable, writable } from 'svelte/store';

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
	private static classRegistry: Record<string, typeof Node> = {};
	static registerClass(id: string, nodeClass: typeof Node) {
		this.classRegistry[id] = nodeClass;
	}
	private state: Map<string, unknown> = new Map();

	getState<T>(key: string, value?: T): T {
		if (!this.state.has(key)) this.state.set(key, value);
		return this.state.get(key) as T;
	}

	setState(key: string, value: unknown) {
		this.state.set(key, value);
	}

	async loadGraph(editorSaveData: NodeEditorSaveData) {
		await this.editor.clear();
		this.editor.setName(editorSaveData.editorName);
		const nodes = new Map<string, Node>();
		for (const nodeSaveData of editorSaveData.nodes) {
			const nodeClass = NodeFactory.classRegistry[nodeSaveData.type];
			if (nodeClass) {
				const node = new nodeClass({ ...nodeSaveData.params, factory: this });
				node.id = nodeSaveData.id;
				node.setState(nodeSaveData.state);
				node.applyState();
				for (const key in nodeSaveData.inputControlValues) {
					const inputControl = node.inputs[key]?.control;
					if (key == 'data-bob') console.log(inputControl);

					if (
						inputControl instanceof ClassicPreset.InputControl ||
						inputControl instanceof InputControl
					) {
						inputControl.setValue(nodeSaveData.inputControlValues[key]);
					}
				}
				nodes.set(nodeSaveData.id, node);

				await this.editor.addNode(node);
				if (nodeSaveData.position)
					this.area.translate(nodeSaveData.id, {
						x: nodeSaveData.position.x,
						y: nodeSaveData.position.y
					});
			} else {
				console.log('Node class not found', nodeSaveData.type);
				throw new Error(`Node class ${nodeSaveData.type} not found`);
			}
		}

		editorSaveData.connections.forEach(async (connectionSaveData) => {
			await this.editor.addConnection(JSON.parse(connectionSaveData));

			// await this.editor.addConnection(JSON.parse(connectionSaveData));

			// await this.editor.addConnection(JSON.parse(connection))
		});
		AreaExtensions.zoomAt(this.area, this.editor.getNodes());
	}
	private area: AreaPlugin<Schemes, AreaExtra>;
	private editor: NodeEditor;

	public readonly dataflowEngine = createDataflowEngine();
	private readonly controlflowEngine = createControlflowEngine();

	constructor(editor: NodeEditor, area: AreaPlugin<Schemes, AreaExtra>) {
		this.area = area;
		this.editor = editor;
		editor.use(this.dataflowEngine);
		editor.use(this.controlflowEngine);

		// Assign connections to nodes
		editor.addPipe((context) => {
			if (context.type !== 'connectioncreated' && context.type !== 'connectionremoved')
				return context;
			const conn = context.data;
			const node = editor.getNode(conn.source);
			const socket = node.outputs[conn.sourceOutput]?.socket;
			const connections =
				socket instanceof ExecSocket || socket?.type == 'exec'
					? node.outgoingExecConnections
					: node.outgoingDataConnections;

			if (context.type === 'connectioncreated') {
				connections[conn.sourceOutput] = conn;
			} else if (context.type === 'connectionremoved') {
				delete connections[conn.sourceOutput];
			}

			return context;
		});
	}

	enable() {
		Node.activeFactory = this;
	}

	disable() {
		Node.activeFactory = undefined;
	}

	create<T extends Node>(type: new () => T): T {
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
			.forEach((n) => {
				try {
					this.dataflowEngine.fetch(n.id);
				} catch (e) {
					if (e && e.message === 'cancelled') {
						console.log('cancelled process', n.id);
					} else {
						throw e;
					}
				}
			});
	}
}
