import { Connection } from '../Node';
import { Input } from '../../Input';
import { Socket } from '../../socket/Socket';
import { type SocketType } from '../../plugin/typed-sockets';
import { ClassicPreset } from 'rete';
import { InputControl } from '../../control/Control';
import { assignControl } from '../../customization/utils';
import { NodeFactory } from '../NodeFactory';
import { AddPinNode, type AddPinNodeState } from '../AddPinNode';

export type MakeArrayNodeState = {
	// Add any additional properties that you need
	type: SocketType;
} & AddPinNodeState;

export class MakeArrayNode extends AddPinNode {
	// type: SocketType = 'any';
	state: MakeArrayNodeState = { ...this.state, type: 'any' };
	initialValues: Record<string, unknown>;
	numConnections = 0;

	constructor({
		factory,
		initialValues = {}
	}: {
		factory: NodeFactory;
		initialValues?: Record<string, unknown>;
	}) {
		// super('Make Array', { factory, height: 160, width: 150 });
		super({
			label: 'Make Array',
			factory,
			height: 160,
			width: 150,
			params: { initialValues },
			numPins: 1
		});

		this.initialValues = initialValues;

		this.addOutData({ name: 'array', isArray: true, type: this.state.type });
		this.loadInitialValues();

		this.getEditor().addPipe((context) => {
			if (!['connectionremoved', 'connectioncreated'].includes(context.type)) return context;

			if (!('data' in context)) return context;

			if (!(context.data instanceof Connection)) return context;

			const conn = context.data;

			if (conn.target !== this.id && conn.source !== this.id) return context;

			if (context.type === 'connectionremoved') {
				this.numConnections--;
				if (this.numConnections === 0) this.changeType('any');
			} else if (context.type === 'connectioncreated') {
				this.numConnections++;

				if (this.state.type !== 'any') return context;

				if (conn.target === this.id) {
					const sourceNode = this.getEditor().getNode(conn.source);
					const sourceOutput = sourceNode.outputs[conn.sourceOutput];
					if (sourceOutput) this.changeType(sourceOutput.socket.type);
				} else if (conn.source === this.id) {
					const targetNode = this.getEditor().getNode(conn.target);
					const targetInput = targetNode.inputs[conn.targetInput];
					if (targetInput) this.changeType(targetInput.socket.type);
				}
			}

			return context;
		});
	}

	loadInitialValues() {
		for (const key in this.inputs) {
			const input = this.inputs[key];
			if (input) {
				const control = input.control as InputControl<unknown>;
				if (control && key in this.initialValues) control.setValue(this.initialValues[key]);
			}
		}
	}
	changeType(to: SocketType) {
		if (this.state.type === to) return;

		this.state.type = to;

		for (const input of Object.values(this.inputs)) {
			if (input) {
				this.changeInputType(input, to);
			}
		}
		this.loadInitialValues();
		const outArray = this.outputs['array'];
		if (outArray) outArray.socket.type = to;
		this.updateElement('node', this.id);
	}

	changeInputType(input: ClassicPreset.Input<Socket>, to: SocketType) {
		input.socket.type = to || 'any';
		const controlType = assignControl(to);
		input.removeControl();
		if (controlType) input.addControl(new InputControl(controlType));
	}

	override data(
		inputs?: Record<string, Input<Socket>> | undefined
	): Record<string, unknown> | Promise<Record<string, unknown>> {
		const data: undefined | unknown[] = [];
		for (const key in this.inputs) {
			data.push(this.getData(key, inputs));
		}

		return { array: data };
	}

	onAddPin(index: number) {
		// console.log('Adding input pin with key data-' + index);
		const type = this.state.type !== undefined ? this.state.type : 'any';

		// console.log('Adding input pin with key data-' + Object.keys(this.inputs).length);

		this.addInData({
			name: `data-${index}`,
			displayName: '',
			isArray: false,
			type: this.state.type || 'any',
			socketLabel: `data-${index}`
		});
		this.height += 36;
		this.changeInputType(this.inputs[`data-${index}`] as Input<Socket>, this.state.type);
		this.loadInitialValues();
		// this.getDataflowEngine().reset(this.id);
		// this.factory.dataflowEngine?.reset(this.id);
		this.updateElement('node', this.id);
	}

	addPin(): void {
		super.addPin();
		this.factory.dataflowEngine?.reset(this.id);
	}
	override applyState(): void {
		super.applyState();
		this.changeInputType(this.inputs['data-0'] as Input<Socket>, this.state.type);
	}
}
