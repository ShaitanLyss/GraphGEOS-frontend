import { ClassicPreset, NodeEditor } from 'rete';
import type { AreaPlugin } from 'rete-area-plugin';
import { ControlFlowEngine, DataflowEngine, DataflowNode } from 'rete-engine';
import type { AreaExtra } from './AreaExtra';
import type { Schemes } from './Schemes';
import type { GetRenderTypes } from 'rete-area-plugin/_types/types';
import { Socket } from '../socket/Socket';
import { ExecSocket } from '../socket/ExecSocket';
import { structures } from 'rete-structures';
import { Output } from '../Output';
import { Input } from '../Input';
import { format } from 'svelte-i18n';
import { Stack } from '../../types/Stack';
import type { SocketType, TypedSocketsPlugin } from '../plugin/typed-sockets';
import {
	Control,
	InputControl,
	InputControlOptions,
	InputControlTypes,
	InputControlValueType
} from '../control/Control';

let area: AreaPlugin<Schemes, AreaExtra>;
let typedSocketsPlugin: TypedSocketsPlugin<Schemes>;

const dataflowEngine = new DataflowEngine<Schemes>(({ inputs, outputs }) => {
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
export const controlflowEngine = new ControlFlowEngine<Schemes>(({ inputs, outputs }) => {
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
let editor: NodeEditor<Schemes>;

function resetSuccessors(node: Node) {
	structures(editor)
		.successors(node.id)
		.nodes()
		.forEach((n) => dataflowEngine.reset(n.id));
}

export function setupMyTypes(_area: AreaPlugin<Schemes, AreaExtra>, _editor: NodeEditor<Schemes>) {
	area = _area;
	editor = _editor;
	editor.use(dataflowEngine);
	editor.use(controlflowEngine);
}

export function process(node: Node) {
	if (node) {
		dataflowEngine.reset(node.id);
		resetSuccessors(node);
	}
	// dataflowEngine.reset();
	editor
		.getNodes()
		// .filter((n) => n instanceof AddNode || n instanceof DisplayNode)
		.forEach((n) => dataflowEngine.fetch(n.id));
}

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
	width?: number;
	height?: number;
}

export class Node<Inputs extends {
	[key in string]?: Socket;
} = {
		[key in string]?: Socket;
	}, Outputs extends {
		[key in string]?: Socket;
	} = {
		[key in string]?: Socket;
	}, Controls extends {
		[key in string]?: Control;
	} = {
		[key in string]?: Control;
	}>
	extends ClassicPreset.Node<Inputs, Outputs, Controls>
	implements DataflowNode
{
	width = 190;
	height = 120;
	private outData: Record<string, unknown> = {};
	private resolveEndExecutes = new Stack<() => void>();
	private naturalFlowExec: string | undefined = 'exec';

	constructor(
		name = '',
		{
			width = 190,
			height = 120,
			path = ''
		}: { width?: number; height?: number; path?: string } = {}
	) {
		super(name);
		format.subscribe((_) => (this.label = _(name)));
		this.width = width;
		this.height = height;
	}

	setNaturalFlow(outExec: string | undefined) {
		this.naturalFlowExec = outExec;
	}

	getNaturalFlow(): string | undefined {
		return this.naturalFlowExec;
	}

	fetchInputs() {
		return dataflowEngine.fetchInputs(this.id);
	}

	getDataflowEngine() {
		return dataflowEngine;
	}

	getEditor() {
		return editor;
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
		process(this);
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
		if (area) area.update(type, id);
		else console.error('Node', 'area is not set');
	}
}

export class Connection extends ClassicPreset.Connection<Node, Node> {}

export const socket = new Socket({ isArray: false, type: 'any' });
