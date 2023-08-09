import { ClassicPreset, NodeEditor } from 'rete';
import type { AreaPlugin } from 'rete-area-plugin';
import type { DataflowNode } from 'rete-engine';
import type { AreaExtra } from './AreaExtra';
import type { Schemes } from './Schemes';
import type { GetRenderTypes } from 'rete-area-plugin/_types/types';
import { Socket } from '../socket/Socket';
import { ExecSocket } from '../socket/ExecSocket';
import { Output } from '../Output';
import { Input } from '../Input';
import { format } from 'svelte-i18n';
import { Stack } from '../../types/Stack';
import type { SocketType, TypedSocketsPlugin } from '../plugin/typed-sockets';
import {
	Control,
	InputControl,
	type InputControlOptions,
	type InputControlTypes,
	type InputControlValueType
} from '../control/Control';
import type { NodeFactory } from './NodeFactory';
import type { ComponentSupportInterface } from '$rete/components/ComponentSupportInterface';
import type { BaseComponent } from '$rete/components/BaseComponent';
import { PythonNodeComponent } from '$rete/components/Python_NC';
import { R_SocketSelection_NC } from '$rete/components/R_SocketSelection_NC';

interface ControlParams<N> {
	type: InputControlTypes;
	options?: InputControlOptions<N>;
}

export interface OutDataParams {
	socketLabel?: string;
	name: string;
	displayName?: string;
	isArray?: boolean;
	type?: SocketType;
}

export interface InDataParams<N> {
	socketLabel?: string;
	name: string;
	displayName?: string;
	initial?: unknown;
	control?: ControlParams<N>;
	isRequired?: boolean;
	isArray?: boolean;
	type?: SocketType;
}

export interface NodeParams {
	label?: string;
	name?: string;
	width?: number;
	height?: number;
	factory: NodeFactory;
	params?: Record<string, unknown>;
}

export type NodeSaveData = {
	params: Record<string, unknown>;
	id: string;
	type: string;
	position?: { x: number; y: number };
	state: Record<string, unknown>;
	inputControlValues: Record<string, unknown>;
	selectedInputs: string[];
	selectedOutputs: string[];
};

export class Node<
		Inputs extends {
			[key in string]: Socket;
		} = {
			[key in string]: Socket;
		},
		Outputs extends {
			[key in string]: Socket;
		} = {
			[key in string]: Socket;
		},
		Controls extends {
			[key in string]: Control;
		} = {
			[key in string]: Control;
		}
	>
	extends ClassicPreset.Node<Inputs, Outputs, Controls>
	implements DataflowNode, ComponentSupportInterface
{
	width = 190;
	height = 120;

	private components: BaseComponent[] = [];
	static activeFactory: NodeFactory | undefined;
	private outData: Record<string, unknown> = {};
	private resolveEndExecutes = new Stack<() => void>();
	private naturalFlowExec: string | undefined = 'exec';
	protected factory: NodeFactory;
	protected params: Record<string, unknown>;
	static id: string;
	static nodeCounts = BigInt(0);
	protected state: Record<string, unknown> = {};
	inputs: { [key in keyof Inputs]?: Input<Exclude<Inputs[key], undefined>> | undefined } = {};
	outputs: { [key in keyof Outputs]?: Output<Exclude<Outputs[key], undefined>> | undefined } = {};
	readonly pythonComponent: PythonNodeComponent;
	readonly socketSelectionComponent: R_SocketSelection_NC;
	readonly ingoingDataConnections: Record<string, Connection<Node, Node>> = {};
	readonly ingoingExecConnections: Record<string, Connection<Node, Node>> = {};
	readonly outgoingDataConnections: Record<string, Connection<Node, Node>> = {};
	readonly outgoingExecConnections: Record<string, Connection<Node, Node>> = {};
	onRemoveIngoingConnection?: (conn: Connection) => void;

	initializePromise?: Promise<void>;
	afterInitialize?: () => void;

	getFactory(): NodeFactory {
		return this.factory;
	}

	constructor(params: NodeParams) {
		const { label = '', width = 190, height = 120, factory } = params;
		super(label);
		this.pythonComponent = this.addComponentByClass(PythonNodeComponent);
		this.socketSelectionComponent = this.addComponentByClass(R_SocketSelection_NC);
		this.state = {};
		Node.nodeCounts++;
		this.params = params.params || {};
		this.factory = factory;
		if (factory === undefined) {
			throw new Error(name + ': Factory is undefined');
		}
		format.subscribe((_) => (this.label = _(label)));
		this.width = width;
		this.height = height;
	}
	setState(state: Record<string, unknown>) {
		this.state = state;
	}

	getOutgoer(key: string): Node | null {
		if (key in this.outgoingExecConnections) {
			return this.getEditor().getNode(this.outgoingExecConnections[key].target);
		} else if (key in this.outgoingDataConnections) {
			return this.getEditor().getNode(this.outgoingDataConnections[key].target);
		}
		return null;
	}

	addComponentByClass<T extends BaseComponent>(
		componentClass: new (options: { owner: Node }) => T
	): T {
		const component = new componentClass({ owner: this });
		this.components.push(component);
		return component;
	}

	getPosition(): { x: number; y: number } | undefined {
		return this.getArea()?.nodeViews.get(this.id)?.position;
	}

	applyState() {
		//to be overriden
	}

	toJSON(): NodeSaveData {
		const inputControlValues: Record<string, unknown> = {};
		const selectedInputs: string[] = [];
		const selectedOutputs: string[] = [];
		for (const key in this.inputs) {
			const value = this.getData(key);
			if (value !== undefined) {
				inputControlValues[key] = value;
			}
			if (this.inputs[key]?.socket.selected) selectedInputs.push(key);
		}
		for (const key in this.outputs) {
			if (this.outputs[key]?.socket.selected) selectedOutputs.push(key);
		}

		// TODO: for all nodes, move state to params
		// TODO: add control values to JSON return
		// TODO: adapt node factory to adapt to new JSON format
		return {
			params: this.params,
			id: this.id,
			type: (this.constructor as typeof Node).id,
			state: this.state,
			position: this.getArea()?.nodeViews.get(this.id)?.position,
			inputControlValues: inputControlValues,
			selectedInputs,
			selectedOutputs
		};
	}

	selectInput(key: string) {
		this.inputs[key]?.socket.select();
	}

	deselectInput(key: string) {
		this.inputs[key]?.socket.deselect();
	}

	selectOutput(key: string) {
		this.outputs[key]?.socket.select();
	}

	deselectOutput(key: string) {
		this.outputs[key]?.socket.deselect();
	}

	setNaturalFlow(outExec: string | undefined) {
		this.naturalFlowExec = outExec;
	}

	getNaturalFlow(): string | undefined {
		return this.naturalFlowExec;
	}

	async fetchInputs() {
		try {
			return await this.factory.dataflowEngine.fetchInputs(this.id);
		} catch (e) {
			if (e && (e as { message: string }).message === 'cancelled') {
				console.log('gracefully cancelled Node.fetchInputs');
				return {};
			} else throw e;
		}
	}

	getDataflowEngine() {
		return this.factory.dataflowEngine;
	}

	getEditor() {
		return this.factory.getEditor();
	}

	getArea() {
		return this.factory.getArea();
	}

	// Callback called at the end of execute
	onEndExecute() {
		if (!this.resolveEndExecutes.isEmpty()) {
			const resolve = this.resolveEndExecutes.pop();
			if (resolve) {
				resolve();
			}
		}
	}

	waitForEndExecutePromise(): Promise<void> {
		return new Promise<void>((resolve) => {
			this.resolveEndExecutes.push(resolve);
		});
	}

	execute(input: string, forward: (output: string) => unknown, forwardExec = true) {
		if (forwardExec && this.outputs.exec) {
			forward('exec');
		}
		this.onEndExecute();
	}

	addInExec(name = 'exec', displayName = '') {
		const input = new Input(new ExecSocket({ name: displayName, node: this }), undefined, true);
		this.addInput(name, input as unknown as Input<Exclude<Inputs[keyof Inputs], undefined>>);
	}

	addOutData({ name = 'data', displayName = '', isArray = false, type = 'any' }: OutDataParams) {
		const output = new Output(
			new Socket({ name: displayName, isArray: isArray, type: type, node: this }),
			displayName
		);
		this.addOutput(name, output as unknown as Output<Exclude<Outputs[keyof Outputs], undefined>>);
	}

	addInData<N>({
		name = 'data',
		displayName = '',
		socketLabel = '',
		control = undefined,
		isArray = false,
		isRequired = false,
		type = 'any'
	}: InDataParams<N>): Input {
		const input = new Input(
			new Socket({
				name: socketLabel,
				isArray: isArray,
				type: type,
				isRequired: isRequired,
				node: this
			}),
			displayName,
			false,
			{ isRequired: isRequired }
		);
		if (control) {
			input.addControl(new InputControl(control.type, control.options));
		}
		this.addInput(name, input as unknown as Input<Exclude<Inputs[keyof Inputs], undefined>>);
		return input;
	}

	addOutExec(name = 'exec', displayName = '', isNaturalFlow = false) {
		if (isNaturalFlow) this.naturalFlowExec = name;
		const output = new Output(new ExecSocket({ name: displayName, node: this }), displayName);
		this.addOutput(name, output as unknown as Output<Exclude<Outputs[keyof Outputs], undefined>>);
	}

	processDataflow = () => {
		this.factory.process(this);
	};

	getWaitPromises(nodes: Node[]): Promise<void>[] {
		return nodes.map((node) => node.waitForEndExecutePromise());
	}

	getData<T extends InputControlTypes, N = InputControlValueType<T>>(
		key: string,
		inputs?: Record<string, unknown>
	): N | undefined {
		// const checkedInputs2 = inputs as Record<string, N>;
		// if (checkedInputs2 && key in checkedInputs2) {
		// 	console.log("get", checkedInputs2[key]);

		// 	return checkedInputs2[key];
		// }

		const checkedInputs = inputs as Record<string, unknown[]>;

		if (checkedInputs && key in checkedInputs) {
			// console.log(checkedInputs);
			// console.log("get0", checkedInputs[key][0]);

			return checkedInputs[key][0] as N;
		}

		if (checkedInputs && key in checkedInputs) {
			// console.log(checkedInputs);
			return checkedInputs[key][0] as N;
		}
		const inputControl = this.inputs[key]?.control as InputControl<T, N>;

		if (inputControl) {
			return inputControl.value;
		}
		return undefined;
	}

	data(
		inputs?: Record<string, unknown> | undefined
	): Record<string, unknown> | Promise<Record<string, unknown>> {
		const res: Record<string, unknown> = {};
		for (const key in this.outputs) {
			if (!(this.outputs[key]?.socket instanceof ExecSocket)) res[key] = undefined;
		}

		return { ...res, ...this.getOutData() };
	}

	setData(key: string, value: unknown) {
		this.outData[key] = value;

		// this.getDataflowEngine().reset(this.id);
		// this.processDataflow();
	}

	getOutData() {
		return this.outData;
	}

	updateElement(type: GetRenderTypes<AreaExtra> = 'node', id?: string): void {
		if (id === undefined) id = this.id;
		const area = this.getArea();
		if (area) {
			area.update(type, id);
		}
	}
}

export class Connection<
	A extends Node = Node,
	B extends Node = Node
> extends ClassicPreset.Connection<A, B> {}
