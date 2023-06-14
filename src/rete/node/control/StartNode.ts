import { Node } from '../Node';
import { ButtonControl } from '../../control/button/button';
import { NodeFactory } from '../NodeFactory';

export class StartNode extends Node {
	constructor({factory} : {factory: NodeFactor) {
		super('Start', { height: 130, factory });
		this.addOutExec();
		this.addControl('playBtn', new ButtonControl('Play', () => this.factory.getControlFlowEngine().execute(this.id)));
	}
	execute(_: never, forward: (output: 'exec') => void) {
		forward('exec');
	}
	data() {
		return {};
	}
}
