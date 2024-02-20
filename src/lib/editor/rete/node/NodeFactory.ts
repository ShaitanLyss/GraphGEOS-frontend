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
import { type Writable, writable } from 'svelte/store';
import { PythonDataflowEngine } from '$rete/engine/PythonDataflowEngine';
import type { MakutuClassRepository } from '$lib/backend-interaction/types';
import { newLocalId } from '$utils';
import type { SelectorEntity } from 'rete-area-plugin/_types/extensions/selectable';
import { ErrorWNotif } from '$lib/global';
import type { AutoArrangePlugin } from 'rete-auto-arrange-plugin';
import wu from 'wu';
import type History from 'rete-history-plugin/_types/history';
import type { HistoryPlugin } from 'rete-history-plugin';

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

function createPythonDataflowEngine() {
	return new PythonDataflowEngine<Schemes>(({ inputs, outputs }) => {
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

// type ParamsConstraint = [Record<string, unknown> & { factory: NodeFactory }, ...unknown[]];
type WithFactory<T extends Record<string, unknown>> = T & { factory: NodeFactory };
type WithoutFactory<T> = Omit<T, 'factory'>;
export class NodeFactory {
	private static classRegistry: Record<string, typeof Node> = {};
	static registerClass(id: string, nodeClass: typeof Node) {
		this.classRegistry[id] = nodeClass;
	}
	private state: Map<string, unknown> = new Map();

	public id = newLocalId('node-factory');

	useState<T = unknown>(
		id: string,
		key: string,
		value?: T
	): { get: () => T; set: (value: T) => void } {
		const stateKey = id + '_' + key;
		if (!this.state.has(stateKey)) this.state.set(stateKey, value);
		return {
			get: () => this.state.get(stateKey) as T,
			set: (value: T) => this.state.set(stateKey, value)
		};
	}

	getState<T>(id: string, key: string, value?: T): T {
		const stateKey = id + '_' + key;
		if (!this.state.has(stateKey)) this.state.set(stateKey, value);
		return this.state.get(stateKey) as T;
	}

	setState(id: string, key: string, value: unknown) {
		this.state.set(id + '_' + key, value);
	}

	lastAddedNode?: Node;
	async addNode<T extends Node, Params = Record<string, unknown>>(
		nodeClass: new (params: Params) => T,
		params: WithoutFactory<Params>
	): Promise<T> {
		const paramsWithFactory: Params = { ...params, factory: this } as Params;

		await this.editor.addNode(new nodeClass(paramsWithFactory));
		if (!this.lastAddedNode) throw new Error('lastAddedNode is undefined');
		return this.lastAddedNode as T;
	}

	getNodes(): Node[] {
		return this.editor.getNodes();
	}

	readonly pythonDataflowEngine: PythonDataflowEngine<Schemes> = createPythonDataflowEngine();

	async loadGraph(editorSaveData: NodeEditorSaveData) {
		console.log('loadGraph', editorSaveData.editorName);
		await this.editor.clear();
		this.editor.variables.set(editorSaveData.variables);
		this.editor.setName(editorSaveData.editorName);
		const nodes = new Map<string, Node>();
		for (const nodeSaveData of editorSaveData.nodes) {
			const nodeClass = NodeFactory.classRegistry[nodeSaveData.type];
			if (nodeClass) {
				const node = new nodeClass({ ...nodeSaveData.params, factory: this });
				node.id = nodeSaveData.id;
				if (node.initializePromise) {
					await node.initializePromise;
					if (node.afterInitialize) node.afterInitialize();
				}

				node.setState({ ...node.getState(), ...nodeSaveData.state });
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

				for (const key of nodeSaveData.selectedInputs) {
					node.selectInput(key);
				}

				for (const key of nodeSaveData.selectedOutputs) {
					node.selectOutput(key);
				}

				await this.editor.addNode(node);
				if (nodeSaveData.position && this.area)
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
			await this.editor.addConnection(connectionSaveData);
		});
		setTimeout(() => {
			if (this.area) AreaExtensions.zoomAt(this.area, this.editor.getNodes());
		});
	}
	private area?: AreaPlugin<Schemes, AreaExtra>;
	private editor: NodeEditor;
	public readonly makutuClasses?: MakutuClassRepository;

	public readonly dataflowEngine = createDataflowEngine();
	private readonly controlflowEngine = createControlflowEngine();
	public readonly selector?: AreaExtensions.Selector<SelectorEntity>;
	public selectableNodes?: ReturnType<typeof AreaExtensions.selectableNodes>;
	public readonly arrange: AutoArrangePlugin<Schemes>;
	public readonly history: HistoryPlugin<Schemes> | undefined;
	constructor(params: {
		editor: NodeEditor;
		area?: AreaPlugin<Schemes, AreaExtra>;
		makutuClasses?: MakutuClassRepository;
		selector?: AreaExtensions.Selector<SelectorEntity>;
		arrange: AutoArrangePlugin<Schemes>;
		history?: HistoryPlugin<Schemes>;
	}) {
		const { editor, area, makutuClasses, selector, arrange } = params;
		this.history = params.history;
		this.selector = selector;
		this.area = area;
		this.arrange = arrange;
		this.makutuClasses = makutuClasses;
		this.editor = editor;
		editor.use(this.dataflowEngine);
		editor.use(this.controlflowEngine);
		editor.use(this.pythonDataflowEngine);

		// Assign connections to nodes
		editor.addPipe((context) => {
			if (context.type === 'nodecreated') {
				this.lastAddedNode = context.data;
			}

			if (context.type !== 'connectioncreated' && context.type !== 'connectionremoved')
				return context;

			const conn = context.data;
			const sourceNode = editor.getNode(conn.source);
			const targetNode = editor.getNode(conn.target);
			this.pythonDataflowEngine.reset(targetNode.id);
			const socket = sourceNode.outputs[conn.sourceOutput]?.socket;
			const outgoingConnections =
				socket instanceof ExecSocket || socket?.type == 'exec'
					? sourceNode.outgoingExecConnections
					: sourceNode.outgoingDataConnections;

			const ingoingConnections =
				socket instanceof ExecSocket || socket?.type == 'exec'
					? targetNode.ingoingExecConnections
					: targetNode.ingoingDataConnections;

			if (context.type === 'connectioncreated') {
				if (!(conn.sourceOutput in outgoingConnections))
					outgoingConnections[conn.sourceOutput] = [];
				if (!(conn.targetInput in ingoingConnections)) ingoingConnections[conn.targetInput] = [];
				outgoingConnections[conn.sourceOutput].push(conn);
				ingoingConnections[conn.targetInput].push(conn);
			} else if (context.type === 'connectionremoved') {
				if (targetNode.onRemoveIngoingConnection) targetNode.onRemoveIngoingConnection(conn);
				const outgoingIndex = outgoingConnections[conn.sourceOutput].findIndex(
					(c) => c.id == conn.id
				);
				if (outgoingIndex === -1) throw new ErrorWNotif("Couldn't find outgoing connection");
				outgoingConnections[conn.sourceOutput].splice(outgoingIndex, 1);
				if (outgoingConnections[conn.sourceOutput].length === 0)
					delete outgoingConnections[conn.sourceOutput];

				const ingoingIndex = ingoingConnections[conn.targetInput].findIndex((c) => c.id == conn.id);
				if (ingoingIndex === -1) throw new ErrorWNotif("Couldn't find ingoing connection");
				ingoingConnections[conn.targetInput].splice(ingoingIndex, 1);
				if (ingoingConnections[conn.targetInput].length === 0)
					delete ingoingConnections[conn.targetInput];
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

	getSelectedNodes(): Node[] | undefined {
		if (!this.selector) return undefined;
		const nodes = wu(this.selector.entities.values())
			.filter(({ label }) => label === 'node')
			.map(({ id }) => this.editor.getNode(id))
			.toArray();
		return nodes.length ? nodes : undefined;
	}

	getNode(id: string): Node | undefined {
		return this.editor.getNode(id);
	}

	getSelectedNodesIds(): Set<Node['id']> | undefined {
		if (!this.selector) return undefined;
		const ids = new Set<Node['id']>();
		wu(this.selector.entities.values())
			.filter(({ label }) => label === 'node')
			.map(({ id }) => id)
			.forEach((id) => ids.add(id));
		return ids.size ? ids : undefined;
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

	getArea(): AreaPlugin<Schemes, AreaExtra> | undefined {
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
			// this.resetSuccessors(node);
		}
		// dataflowEngine.reset();
		try {
			this.editor
				.getNodes()
				// .filter((n) => n instanceof AddNode || n instanceof DisplayNode)
				.forEach((n) => {
					this.dataflowEngine.fetch(n.id);
				});
		} catch (e) {}
	}
}
