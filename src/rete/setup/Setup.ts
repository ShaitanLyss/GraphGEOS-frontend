import type { AreaPlugin } from 'rete-area-plugin';
import type { NodeEditor } from '../NodeEditor';
import type { Schemes } from '../node/Schemes';
import type { AreaExtra } from '../node/AreaExtra';
import type { NodeFactory } from '../node/NodeFactory';

export abstract class Setup {
	abstract setup(
		editor: NodeEditor,
		area: AreaPlugin<Schemes, AreaExtra>,
		factory: NodeFactory
	): void;
}
