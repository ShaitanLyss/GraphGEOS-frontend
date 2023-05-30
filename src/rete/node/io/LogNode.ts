import { Input } from '../../Input';
import { Socket } from '../../socket/Socket';
import { Node } from '../Node';
import { notifications } from '@mantine/notifications';
import { ClassicPreset } from 'rete';

export class LogNode extends Node {
	constructor() {
		super('Log');
		this.height = 200;
		this.addInExec();
		this.addOutExec();
		
		const messageInput = new Input(new Socket(), 'Message');
		messageInput.addControl(new ClassicPreset.InputControl('text', { initial: 'Hello' }));
		this.addInput('message', messageInput);
	}

	async execute(input: string, forward: (output: string) => unknown) {		
		const messageControl = this.inputs.message?.control as ClassicPreset.InputControl<'text'>;

		const inputs = (await this.fetchInputs()) as {
			message: string[];
		};
		const res = inputs.message ? inputs.message[0] : messageControl.value;
		console.log(res);
		
		notifications.show({ title: 'Log', message: res });
		
		forward('exec');
	}

	data() {
		return {};
	}
}
