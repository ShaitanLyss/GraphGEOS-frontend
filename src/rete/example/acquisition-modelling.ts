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
import { TimeLoopNode } from '../node/control/TimeLoopNode';
import { OutputVtkNode } from '../node/makutu/solver/OutputVtk';
import { EveryNode } from '../node/control/EveryNode';
import { MakeArrayNode } from '../node/data/MakeArrayNode';
import { NumberNode } from '../node/math/NumberNode';
import { SequenceNode } from '../node/control/SequenceNode';
import { LogNode } from '../node/io/LogNode';
import { ExecuteNode } from '../node/makutu/solver/ExecuteNode';
import { FormatNode } from '../node/io/FormatNode';

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
	// await editor.addNewConnection(foreachShot, 'loop', initializeSolver, 'exec');

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

	const sequence = new SequenceNode();

	await editor.addNode(sequence);

	const outputVtk = new OutputVtkNode();
	await editor.addNode(outputVtk);

	const every = new EveryNode(50);
	await editor.addNode(every);
	await editor.addNewConnection(sequence, 'exec-0', every, 'exec');
	await editor.addExecConnection(every, outputVtk);

	await editor.addNewConnection(timeLoop, 'loop', sequence, 'exec');

	const executeSolver = new ExecuteNode();
	await editor.addNode(executeSolver);
	await editor.addNewConnection(sequence, 'exec-1', executeSolver, 'exec');

	const format = new FormatNode({ format: 'Shot {index} done' });
	await editor.addNode(format);
	await editor.addNewConnection(foreachShot, 'index', format, 'data-index');
	const sequenceAfterForEach = new SequenceNode();
	await editor.addNode(sequenceAfterForEach);
	const logShotDone = new LogNode();
	await editor.addNode(logShotDone);
	await editor.addNewConnection(foreachShot, 'loop', sequenceAfterForEach, 'exec');

	await editor.addNewConnection(sequenceAfterForEach, 'exec-0', initializeSolver, 'exec');
	await editor.addNewConnection(sequenceAfterForEach, 'exec-1', logShotDone, 'exec');
	await editor.addNewConnection(format, 'result', logShotDone, 'message');
	
	const logGatheringAndExportingSeismos = new LogNode({message: "Gathering and exporting seismos"});
	await editor.addNode(logGatheringAndExportingSeismos);
	await editor.addExecConnection(logShotDone, logGatheringAndExportingSeismos);

	
	

	return [foreachShot, logShotDone];
	// return editor.getNodes();
}
