import { ClassicPreset } from 'rete';
import { Output } from '../../Output';
import { Node, controlflowEngine } from '../Node';
import { ButtonControl } from '../../control/button/button';

export class StartNode extends Node {
	constructor() {
		super('Start', { height: 130 });
		this.addOutExec();
		this.addControl('playBtn', new ButtonControl('Play', () => controlflowEngine.execute(this.id)));
	}
	execute(_: never, forward: (output: 'exec') => void) {
		forward('exec');
	}
	data() {
		return {};
	}
}
