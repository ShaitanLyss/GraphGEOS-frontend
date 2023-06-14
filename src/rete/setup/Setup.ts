import { AreaPlugin } from 'rete-area-plugin';
import { NodeEditor } from '../NodeEditor';
import { Schemes } from '../node/Schemes';
import { AreaExtra } from '../node/AreaExtra';
import { NodeFactory } from '../node/NodeFactory';

export abstract class Setup {
	abstract setup(
		editor: NodeEditor,
		area: AreaPlugin<Schemes, AreaExtra>,
		factory: NodeFactory
	): void;
}
