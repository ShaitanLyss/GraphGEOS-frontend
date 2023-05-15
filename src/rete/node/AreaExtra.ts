import type { ContextMenuExtra } from 'rete-context-menu-plugin';
import type { MinimapExtra } from 'rete-minimap-plugin';
import type { ReactArea2D } from 'rete-react-render-plugin';
import type { Schemes } from './Schemes';

export type AreaExtra = ReactArea2D<Schemes> | ContextMenuExtra | MinimapExtra;
