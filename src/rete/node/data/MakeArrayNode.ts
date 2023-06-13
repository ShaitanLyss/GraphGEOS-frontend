import { Connection, Node } from '../Node';
import { ButtonControl } from '../../control/button/button';
import { Input } from '../../Input';
import { Socket } from '../../socket/Socket';
import { SocketType } from '../../plugin/typed-sockets';
import { ClassicPreset } from 'rete';

export class MakeArrayNode extends Node {
	type: SocketType = 'any';
	numConnections = 0;

	constructor() {
		super('Make Array', { height: 160, width: 150 });
		this.addOutData({ name: 'array', isArray: true, type: 'any' });
		this.addInData({ name: 'data-0' });

		this.getEditor().addPipe((context) => {
			
			console.log("pipe");
			
			
			
			if (!(['connectionremoved', 'connectioncreated'].includes(context.type)))
			return context;
			console.log(typeof context.data);
			
			if (!(context.data instanceof Connection))
			return context;
			
			const conn = context.data;
			
			console.log("context", context);
			if (conn.target !== this.id && conn.source !== this.id)
				return context;

			console.log(conn);



			if (context.type === 'connectionremoved') {
				this.numConnections--;
				if (this.numConnections === 0)
					this.changeType('any');
			} else if (context.type === 'connectioncreated') {
				this.numConnections++;
				

				if (this.type !== 'any')
					return context;

				if (conn.target === this.id) {
					const sourceNode = this.getEditor().getNode(conn.source);
					const sourceOutput = sourceNode.outputs[conn.sourceOutput];
					if (sourceOutput)
						this.changeType(sourceOutput.socket.type);

				} else if (conn.source === this.id) {
					const targetNode = this.getEditor().getNode(conn.target);
					const targetInput = targetNode.inputs[conn.targetInput];
					if (targetInput)
						this.changeType(targetInput.socket.type);
				}
			}

			console.log("numConnections", this.numConnections);
			return context;
		});


		this.addControl('addPinBtn', new ButtonControl('+', this.addPin.bind(this)));
	}
	changeType(to: SocketType) {
		this.type = to;
		for (const input of Object.values(this.inputs)) {
			if (input)
				input.socket.type = to;
		}
		const outArray = this.outputs["array"];
		if (outArray)
			outArray.socket.type = to;
		this.updateElement('node', this.id);
	}

	override data(
		inputs?: Record<string, Input<Socket>> | undefined
	): Record<string, unknown> | Promise<Record<string, unknown>> {
		const data: undefined | unknown[] = [];
		for (const key in inputs) {
			data.push(inputs[key][0]);
		}

		return { array: data };
	}

	addPin() {
		// console.log('Adding input pin with key data-' + Object.keys(this.inputs).length);

		this.addInData({
			name: `data-${Object.keys(this.inputs).length}`,
			displayName: '',
			isArray: false,
			type: this.type,
		});
		this.height += 36;
		this.updateElement('node', this.id);
	}
}
