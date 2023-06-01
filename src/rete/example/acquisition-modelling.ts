import { SEGYAcquisitionNode } from '../node/makutu/acquisition/SEGYAcquisitionNode';
import { StartNode } from '../node/control/StartNode';
import { Connection } from '../node/Node';
import { NodeEditor } from '../NodeEditor';
import { ForEachNode } from '../node/control/ForEachNode';
import { BreakNode } from '../node/makutu/acquisition/BreakNode';
import { AcousticSEMNode } from '../node/makutu/solver/AcousticSEMNode';
import { InitializeSolverNode } from '../node/makutu/solver/InitializeSolverNode';

export async function acquisitionModelingExample(editor: NodeEditor) {
	const start = new StartNode();
	await editor.addNode(start);

	const segy = new SEGYAcquisitionNode();
	await editor.addNode(segy);

	await editor.addExecConnection(start, segy);

	const foreachShot = new ForEachNode();
	await editor.addNode(foreachShot);

	await editor.addExecConnection(segy, foreachShot);
	await editor.addConnection(new Connection(segy, 'shots', foreachShot, 'array'));

	const breakShot = new BreakNode();
	await editor.addNode(breakShot);

	await editor.addConnection(new Connection(foreachShot, 'item', breakShot, 'object'));

    const initializeSolver = new InitializeSolverNode();
    await editor.addNode(initializeSolver);

    await editor.addExecConnection(foreachShot, initializeSolver);

    const solver = new AcousticSEMNode();
    await editor.addNode(solver);

    await editor.addConnection(new Connection(solver, 'solver', initializeSolver, 'solver'));
}
