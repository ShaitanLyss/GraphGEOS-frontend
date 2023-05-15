import { MinimapPlugin } from 'rete-minimap-plugin';
import type { Connection, Node } from '../node/MyTypes';
import type { Schemes } from '../node/Schemes';
import type { AreaExtra } from '../node/AreaExtra';
import type { AreaPlugin } from 'rete-area-plugin';

export function setupMinimap(area: AreaPlugin<Schemes, AreaExtra>) {
	const minimap = new MinimapPlugin<Schemes>();
	area.use(minimap);
}
