import { NodeEditor } from 'rete';
import { Schemes } from '../node/Schemes';
import { NumberNode } from '../node/math/NumberNode';
import { AddNode } from '../node/math/AddNode';
import { Connection } from '../node/Node';
import { DisplayNode } from '../node/io/DisplayNode';

export async function sumExample(editor: NodeEditor<Schemes>) {
	const numberNode = new NumberNode(2);
	editor.addNode(numberNode);
	const numberNode2 = new NumberNode(3);
	editor.addNode(numberNode2);

	const addNode = new AddNode({ b: 3 });
	await editor.addNode(addNode);

	await editor.addConnection(new Connection(numberNode, 'value', addNode, 'left'));
	await editor.addConnection(new Connection(numberNode2, 'value', addNode, 'right'));

	const displayNode = new DisplayNode(3);
	await editor.addNode(displayNode);
	await editor.addConnection(new Connection(addNode, 'value', displayNode, 'input'));

	return editor.getNodes();
}
