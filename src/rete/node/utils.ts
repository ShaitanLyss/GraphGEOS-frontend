import { structures } from 'rete-structures';
import { Connection, Node } from './Node';
import { EveryNode } from './control/EveryNode';

// TODO : make the leave every or every leave based on every node current
export function getLeavesFromOutput(node: Node, key: string): Node[] {
	const connections = node.getEditor().getConnections();

	const loopNode = connections
		.filter(
			(connection) =>
				connection.source === node.id && (connection as Connection).sourceOutput === key
		)
		.map((connection) => node.getEditor().getNode(connection.target))[0];

	if (!loopNode) return [];

	const struct = structures(node.getEditor());
	const successors = struct.successors(node.id);
	const tree = struct.successors(loopNode.id);
	
	const everyNodes = tree.filter((node) => node instanceof EveryNode && !node.isFlowing()).nodes();
	const everyNodesSuccessors = everyNodes.map((node) => struct.successors(node.id).nodes()).flat();

	const cleanedTree = tree.difference({
		nodes: [...everyNodes, ...everyNodesSuccessors],
		connections: []
	});

	const leaves = cleanedTree.leaves().nodes();
	console.log(everyNodes);
	
	
	console.log([...leaves, ...everyNodes]);
	
	return [...leaves, ...everyNodes];
}
