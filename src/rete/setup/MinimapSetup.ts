import { AreaPlugin } from 'rete-area-plugin';
import { NodeEditor } from '../NodeEditor';
import { AreaExtra } from '../node/AreaExtra';
import { Schemes } from '../node/Schemes';
import { Setup } from './Setup';
import { MinimapPlugin } from 'rete-minimap-plugin';
import { NodeFactory } from '../node/NodeFactory';

export class MinimapSetup extends Setup {
	private minimap = new MinimapPlugin<Schemes>();
	setup(editor: NodeEditor, area: AreaPlugin<Schemes, AreaExtra>, factory: NodeFactory): void {
		area.use(this.minimap);
	}
}
