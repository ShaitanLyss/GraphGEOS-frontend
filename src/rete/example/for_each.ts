import { NodeEditor } from 'rete';
import { Schemes } from '../node/Schemes';
import { Connection } from '../node/Node';
import { StartNode } from '../node/control/StartNode';
import { LogNode } from '../node/io/LogNode';
import { MakeArrayNode } from '../node/data/MakeArrayNode';
import { NumberNode } from '../node/math/NumberNode';
import { ForEachNode } from '../node/control/ForEachNode';
import { EditorExample } from './types';
import { NodeFactory } from '../node/NodeFactory';

export const forEachExample: EditorExample = async (factory: NodeFactory) => {
	const editor = factory.getEditor();
	factory.enable();
	const start = new StartNode();
	await editor.addNode(start);

	const log = new LogNode({ message: "Hello I'll show you some numbers" });
	await editor.addNode(log);

	await editor.addConnection(new Connection(start, 'exec', log, 'exec'));
	const makeArray = new MakeArrayNode();
	await editor.addNode(makeArray);
	makeArray.addPin();
	makeArray.addPin();
	const number1 = new NumberNode(1);
	await editor.addNode(number1);
	const number2 = new NumberNode(2);
	await editor.addNode(number2);
	const number3 = new NumberNode(3);
	await editor.addNode(number3);
	await editor.addConnection(new Connection(number1, 'value', makeArray, 'data-0'));
	await editor.addConnection(new Connection(number2, 'value', makeArray, 'data-1'));
	await editor.addConnection(new Connection(number3, 'value', makeArray, 'data-2'));

	const forEach = new ForEachNode();
	await editor.addNode(forEach);
	await editor.addConnection(new Connection(makeArray, 'array', forEach, 'array'));
	await editor.addConnection(new Connection(log, 'exec', forEach, 'exec'));
	const logItem = new LogNode({});
	await editor.addNode(logItem);
	await editor.addConnection(new Connection(forEach, 'item', logItem, 'message'));
	await editor.addConnection(new Connection(forEach, 'loop', logItem, 'exec'));
	const logEnd = new LogNode({ message: "I'm done!" });
	await editor.addNode(logEnd);
	await editor.addConnection(new Connection(forEach, 'exec', logEnd, 'exec'));

	return editor.getNodes();
}
