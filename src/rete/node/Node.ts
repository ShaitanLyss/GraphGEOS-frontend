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
import type { SocketType, TypedSocketsPlugin } from '../plugin/typed-sockets';
import {
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

interface DataParams<N> {
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

export class Node
	extends ClassicPreset.Node<{ [x: string]: Socket }, { [x: string]: Socket }>
	implements DataflowNode
{
	width = 190;
	height = 120;

	private resolveEndExecute?: () => void;

	constructor(
		name = '',
		{
			width = 190,
			height = 120,
			path = ''
		}: { width?: number; height?: number; path?: string } = {}
	) {
		super(name);
		this.width = width;
		this.height = height;
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
		if (this.resolveEndExecute) {
			this.resolveEndExecute();
		}
		this.resolveEndExecute = undefined;
	}

	waitForEndExecutePromise(): Promise<void> {
		return new Promise<void>((resolve) => {
			this.resolveEndExecute = resolve;
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

	addOutData<N>({ name = 'data', displayName = '', isArray = false, type = 'any' }: DataParams<N>) {
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
	}: DataParams<N>) {
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

	addOutExec(name = 'exec', displayName = '') {
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
		const checkedInputs = inputs as Record<string, N[]>;

		if (checkedInputs && key in checkedInputs) {
			console.log(checkedInputs);
			return checkedInputs[key][0];
		}
		const inputControl = this.inputs[key]?.control as InputControl<T, N>;

		if (inputControl) {
			return inputControl.value;
		}
		return undefined;
	}

	data(
		inputs?: Record<string, unknown>
	): Record<string, unknown> | Promise<Record<string, unknown>> {
		return {};
	}

	updateElement(type: GetRenderTypes<AreaExtra>, id: string): void {
		if (area) area.update(type, id);
		else console.error('Node', 'area is not set');
	}
}

export class Connection extends ClassicPreset.Connection<Node, Node> {}

export const socket = new Socket({ isArray: false, type: 'any' });
