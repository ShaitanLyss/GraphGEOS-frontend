import { ClassicPreset, NodeEditor } from 'rete';
import type { AreaPlugin } from 'rete-area-plugin';
import { DataflowEngine, DataflowNode } from 'rete-engine';
import type { AreaExtra } from './AreaExtra';
import type { Schemes } from './Schemes';
import type { GetRenderTypes } from 'rete-area-plugin/_types/types';
import { Socket } from '../socket/Socket';
import { structures } from 'rete-structures';

let area: AreaPlugin<Schemes, AreaExtra>;
const dataflowEngine = new DataflowEngine<Schemes>();
let editor: NodeEditor<Schemes>;

function resetSuccessors(node: Node) {
	structures(editor)
		.successors(node.id)
		.nodes()
		.forEach((n) => dataflowEngine.reset(n.id));
}

export function setupMyTypes(_area: AreaPlugin<Schemes, AreaExtra>, _editor: NodeEditor<Schemes>) {
	area = _area;
	editor = _editor;
	editor.use(dataflowEngine);
}

export function process(node: Node) {
	if (node) {
		dataflowEngine.reset(node.id);
		resetSuccessors(node);
	}
	// dataflowEngine.reset();
	editor
		.getNodes()
		// .filter((n) => n instanceof AddNode || n instanceof DisplayNode)
		.forEach((n) => dataflowEngine.fetch(n.id));
}

export class Node
	extends ClassicPreset.Node<{ [x: string]: Socket }, { [x: string]: Socket }>
	implements DataflowNode
{
	width = 190;
	height = 120;

	constructor(name: string) {
		super(name);
	}

	processDataflow = () => {
		process(this);
	};

	data(
		inputs?: Record<string, unknown>
	): Record<string, unknown> | Promise<Record<string, unknown>> {
		throw new Error('Method not implemented.');
	}

	updateElement(type: GetRenderTypes<AreaExtra>, id: string): void {
		if (area) area.update(type, id);
		else console.error('Node', 'area is not set');
	}
}

export class Connection extends ClassicPreset.Connection<Node, Node> {}

export const socket = new Socket({ isArray: false, type: 'any' });
