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
};

export class Node<
	Inputs extends {
		[key in string]?: Socket;
	} = {
		[key in string]?: Socket;
	},
	Outputs extends {
		[key in string]?: Socket;
	} = {
		[key in string]?: Socket;
	},
	Controls extends {
		[key in string]?: Control;
	} = {
		[key in string]?: Control;
	}
>
	extends ClassicPreset.Node<Inputs, Outputs, Controls>
	implements DataflowNode {
	width = 190;
	height = 120;
	static activeFactory: NodeFactory | undefined;
	private outData: Record<string, unknown> = {};
	private resolveEndExecutes = new Stack<() => void>();
	private naturalFlowExec: string | undefined = 'exec';
	protected factory: NodeFactory;
	protected params: Record<string, unknown>;
	static id: string;
	static nodeCounts: bigint = BigInt(0);
	protected state: Record<string, unknown> = {};

	constructor(params: NodeParams) {
		const { label = '', width = 190, height = 120, factory } = params;
		super(label);
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

	getPosition(): { x: number; y: number } | undefined {
		return this.getArea().nodeViews.get(this.id)?.position;
	}

	applyState() { }

	toJSON(): NodeSaveData {
		const inputControlValues: Record<string, unknown> = {};
		for (const key in this.inputs) {
			const value = this.getData(key);
			if (value !== undefined) {
				inputControlValues[key] = value;
			}
		}
		// TODO: for all nodes, move state to params
		// TODO: add control values to JSON return
		// TODO: adapt node factory to adapt to new JSON format
		return {
			params: this.params,
			id: this.id,
			type: (this.constructor as typeof Node).id,
			state: this.state,
			position: this.getArea().nodeViews.get(this.id)?.position,
			inputControlValues: inputControlValues
		};
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
			if (e && e.message === 'cancelled') {
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
		this.addInput(name, new Input(new ExecSocket({ name: displayName }), undefined, true));
	}

	addOutData({ name = 'data', displayName = '', isArray = false, type = 'any' }: OutDataParams) {
		this.addOutput(
			name,
			new Output(new Socket({ name: displayName, isArray: isArray, type: type }), displayName)
		);
	}

	addInData<N>({
		name = 'data',
		displayName = '',
		socketLabel = '',
		control = undefined,
		isArray = false,
		isRequired = false,
		type = 'any'
	}: InDataParams<N>) {
		const input = new Input(
			new Socket({ name: socketLabel, isArray: isArray, type: type, isRequired: isRequired }),
			displayName,
			false,
			{ isRequired: isRequired }
		);
		if (control) {
			input.addControl(new InputControl(control.type, control.options));
		}
		this.addInput(name, input);
	}

	addOutExec(name = 'exec', displayName = '', isNaturalFlow = false) {
		if (isNaturalFlow) this.naturalFlowExec = name;
		this.addOutput(name, new Output(new ExecSocket({ name: displayName }), displayName));
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

			return checkedInputs[key][0];
		}

		if (checkedInputs && key in checkedInputs) {
			// console.log(checkedInputs);
			return checkedInputs[key][0];
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

	updateElement(type: GetRenderTypes<AreaExtra>, id: string): void {

		if (this.getArea()) {
			console.log("yarreeeeeeenderrr")
			this.getArea().update(type, id);
		}


		else console.error('Node', 'area is not set');
	}
}

export class Connection<A extends Node, B extends Node> extends ClassicPreset.Connection<A, B> { }

export const socket = new Socket({ isArray: false, type: 'any' });
