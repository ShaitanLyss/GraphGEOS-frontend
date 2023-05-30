import { Input } from '../../Input';
import { Socket } from '../../socket/Socket';
import { Node } from '../Node';
import { notifications } from '@mantine/notifications';

export class LogNode extends Node {
	constructor() {
		super('Log');
		this.height = 200;
		this.addInExec();
		this.addOutExec();

		this.addInput('msg', new Input(new Socket(), 'Message'));
	}

	execute(input: string, forward: (output: string) => unknown): void {
		notifications.show({ title: 'Log', message: 'Hey there' });
		console.log(this.inputs.msg);
		forward('exec');
	}

	data() {
		return {};
	}
}
