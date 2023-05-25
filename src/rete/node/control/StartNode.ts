import { Output } from '../../Output';
import { Node } from '../MyTypes';

export class StartNode extends Node {
	constructor() {
		super('Start');
		this.addOutExec();
	}
	execute(_: never, forward: (output: 'exec') => void) {
		forward('exec');
	}
	data() {
		return {};
	}
}
