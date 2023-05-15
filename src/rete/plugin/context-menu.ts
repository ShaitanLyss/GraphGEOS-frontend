import { ContextMenuPlugin, Presets } from 'rete-context-menu-plugin';
import { AddNode } from '../node/math/AddNode';
import { NumberNode } from '../node/math/NumberNode';
import { DisplayNode } from '../node/math/DisplayNode';
import type { Schemes } from '../node/Schemes';
import type { AreaPlugin } from 'rete-area-plugin';
import type { AreaExtra } from '../node/AreaExtra';

export function setupContextMenu(area: AreaPlugin<Schemes, AreaExtra>) {
	const contextMenu = new ContextMenuPlugin<Schemes>({
		items: Presets.classic.setup([
			['Add', () => new AddNode()],
			['Number', () => new NumberNode(0)],
			['Display', () => new DisplayNode(0)]
		])
	});
	area.use(contextMenu);
}
