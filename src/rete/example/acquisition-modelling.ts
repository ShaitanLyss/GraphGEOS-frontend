import { SEGYAcquisitionNode } from '../node/makutu/acquisition/SEGYAcquisitionNode';
import { StartNode } from '../node/control/StartNode';
import { Connection } from '../node/Node';
import { NodeEditor } from '../NodeEditor';
import { ForEachNode } from '../node/control/ForEachNode';
import { BreakNode } from '../node/makutu/acquisition/BreakNode';
import { AcousticSEMNode } from '../node/makutu/solver/AcousticSEMNode';
import { InitializeSolverNode } from '../node/makutu/solver/InitializeSolverNode';
import { ApplyInitialConditionsNode } from '../node/makutu/solver/ApplyInitialConditionsNode';
import { UpdateSourcesAndReceiversNode } from '../node/makutu/solver/UpdateSourceAndReceivers';
import { UpdateVtkOutputNode } from '../node/makutu/solver/UpdateVtkOutput';
import { AppendNode } from '../node/io/AppendNode';
import { DisplayNode } from '../node/io/DisplayNode';
import { TimeLoopNode } from '../node/control/TimeLoopNode';
import { AreaExtensions } from 'rete-area-plugin';
import { OutputVtkNode } from '../node/makutu/solver/OutputVtk';
import { EveryNode } from '../node/control/EveryNode';
import { MakeArrayNode } from '../node/data/MakeArrayNode';
import {NumberNode} from '../node/math/NumberNode'

export async function acquisitionModelingExample(editor: NodeEditor) {
	const start = new StartNode();
	await editor.addNode(start);

	const segy = new SEGYAcquisitionNode();
	await editor.addNode(segy);

	await editor.addExecConnection(start, segy);

	const foreachShot = new ForEachNode();
	await editor.addNode(foreachShot);

	await editor.addExecConnection(segy, foreachShot);
	// await editor.addConnection(new Connection(segy, 'shots', foreachShot, 'array'));

	const tmpArray = new MakeArrayNode();
	tmpArray.addPin();
	await editor.addNode(tmpArray);
	await editor.addConnection(new Connection(tmpArray, 'array', foreachShot, 'array'));
	const nbr = new NumberNode(0);
	await editor.addNode(nbr);
	await editor.addConnection(new Connection(nbr, 'value', tmpArray, 'data-1'));
	await editor.addConnection(new Connection(nbr, 'value', tmpArray, 'data-0'));

	const breakShot = new BreakNode();
	await editor.addNode(breakShot);

	await editor.addConnection(new Connection(foreachShot, 'item', breakShot, 'object'));

	const initializeSolver = new InitializeSolverNode();
	await editor.addNode(initializeSolver);

	await editor.addNewConnection(breakShot, 'xml', initializeSolver, 'xml');
	await editor.addNewConnection(foreachShot, 'loop', initializeSolver, 'exec');

	const solver = new AcousticSEMNode();
	await editor.addNode(solver);

	await editor.addConnection(new Connection(solver, 'solver', initializeSolver, 'solver'));

	const applyInitialConditions = new ApplyInitialConditionsNode();
	await editor.addNode(applyInitialConditions);

	await editor.addExecConnection(initializeSolver, applyInitialConditions);
	await editor.addNewConnection(initializeSolver, 'solver', applyInitialConditions, 'solver');

	const update_source_receivers = new UpdateSourcesAndReceiversNode();
	await editor.addNode(update_source_receivers);

	await editor.addExecConnection(applyInitialConditions, update_source_receivers);
	await editor.addNewConnection(
		applyInitialConditions,
		'solver',
		update_source_receivers,
		'solver'
	);

	await editor.addNewConnection(breakShot, 'sourceCoords', update_source_receivers, 'sourceCoords');
	await editor.addNewConnection(
		breakShot,
		'receiverCoords',
		update_source_receivers,
		'receiverCoords'
	);

	const updateVtkOutput = new UpdateVtkOutputNode();
	await editor.addNode(updateVtkOutput);

	await editor.addExecConnection(update_source_receivers, updateVtkOutput);
	await editor.addNewConnection(update_source_receivers, 'solver', updateVtkOutput, 'solver');

	const append = new AppendNode({ a: 'Shot', sep: '' });
	await editor.addNode(append);

	await editor.addNewConnection(append, 'result', updateVtkOutput, 'directory');

	// const display = new DisplayNode();
	// await editor.addNode(display);

	// await editor.addNewConnection(append, 'result', display, 'input');

	await editor.addNewConnection(breakShot, 'id', append, 'b');

	const timeLoop = new TimeLoopNode();
	await editor.addNode(timeLoop);

	await editor.addExecConnection(updateVtkOutput, timeLoop);

	const outputVtk = new OutputVtkNode();
	await editor.addNode(outputVtk);

	const every = new EveryNode();
	await editor.addNode(every);

	await editor.addNewConnection(timeLoop, 'loop', every, 'exec');
	await editor.addExecConnection(every, outputVtk);

	// return [timeLoop, update_source_receivers];
	return editor.getNodes();
}
