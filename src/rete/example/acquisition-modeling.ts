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
import { GetPressuresAtReceiversNode } from '../node/makutu/solver/GetPressureAtReceiversNode';
import { EditorExample } from './types';
import { NodeFactory } from '../node/NodeFactory';

export const acquisitionModelingExample: EditorExample= async (factory: NodeFactory) => {
	const editor = factory.getEditor();
	const start = new StartNode({factory});
	await editor.addNode(start);

	const segy = new SEGYAcquisitionNode({factory});
	await editor.addNode(segy);

	await editor.addExecConnection(start, segy);

	const foreachShot = new ForEachNode({factory});
	await editor.addNode(foreachShot);

	await editor.addExecConnection(segy, foreachShot);
	// await editor.addConnection(new Connection(segy, 'shots', foreachShot, 'array'));

	await editor.addNewConnection(segy, 'shots', foreachShot, 'array');

	const breakShot = new BreakNode({factory});
	await editor.addNode(breakShot);

	await editor.addNewConnection(foreachShot, 'item', breakShot, 'object');

	const initializeSolver = new InitializeSolverNode({factory});
	await editor.addNode(initializeSolver);

	await editor.addNewConnection(breakShot, 'xml', initializeSolver, 'xml');
	// await editor.addNewConnection(foreachShot, 'loop', initializeSolver, 'exec');

	const solver = new AcousticSEMNode({factory});
	await editor.addNode(solver);
	await editor.addExecConnection(start, solver);
	await editor.addExecConnection(solver, segy);

	await editor.addNewConnection(solver, 'solver', initializeSolver, 'solver');

	const applyInitialConditions = new ApplyInitialConditionsNode({factory});
	await editor.addNode(applyInitialConditions);

	await editor.addExecConnection(initializeSolver, applyInitialConditions);
	await editor.addNewConnection(initializeSolver, 'solver', applyInitialConditions, 'solver');

	const update_source_receivers = new UpdateSourcesAndReceiversNode({factory});
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

	const updateVtkOutput = new UpdateVtkOutputNode({factory});
	await editor.addNode(updateVtkOutput);

	await editor.addExecConnection(update_source_receivers, updateVtkOutput);
	await editor.addNewConnection(update_source_receivers, 'solver', updateVtkOutput, 'solver');

	const append = new AppendNode({ factory, a: 'Shot', sep: '' });
	await editor.addNode(append);

	await editor.addNewConnection(append, 'result', updateVtkOutput, 'directory');

	// const display = new DisplayNode();
	// await editor.addNode(display);

	// await editor.addNewConnection(append, 'result', display, 'input');

	await editor.addNewConnection(breakShot, 'id', append, 'b');

	const timeLoop = new TimeLoopNode({factory});
	await editor.addNode(timeLoop);

	await editor.addExecConnection(updateVtkOutput, timeLoop);

	const sequence = new SequenceNode({factory});

	await editor.addNode(sequence);

	const outputVtk = new OutputVtkNode({factory});
	await editor.addNode(outputVtk);

	const every = new EveryNode({factory, count: 50});
	await editor.addNode(every);
	await editor.addNewConnection(sequence, 'exec-0', every, 'exec');
	await editor.addExecConnection(every, outputVtk);

	await editor.addNewConnection(timeLoop, 'loop', sequence, 'exec');

	const executeSolver = new ExecuteNode({factory});
	await editor.addNode(executeSolver);
	await editor.addNewConnection(sequence, 'exec-1', executeSolver, 'exec');

	const format = new FormatNode({factory, format: 'Shot {index} done' });
	await editor.addNode(format);
	await editor.addNewConnection(foreachShot, 'index', format, 'data-index');
	const sequenceAfterForEach = new SequenceNode({factory});
	await editor.addNode(sequenceAfterForEach);
	const logShotDone = new LogNode({factory});
	await editor.addNode(logShotDone);
	await editor.addNewConnection(foreachShot, 'loop', sequenceAfterForEach, 'exec');

	await editor.addNewConnection(sequenceAfterForEach, 'exec-0', initializeSolver, 'exec');
	await editor.addNewConnection(sequenceAfterForEach, 'exec-1', logShotDone, 'exec');
	await editor.addNewConnection(format, 'result', logShotDone, 'message');

	const logGatheringAndExportingSeismos = new LogNode({factory,
		message: 'Gathering and exporting seismos'
	});
	await editor.addNode(logGatheringAndExportingSeismos);
	await editor.addExecConnection(logShotDone, logGatheringAndExportingSeismos);
	await editor.addNewConnection(updateVtkOutput, 'solver', executeSolver, 'solver');
	await editor.addNewConnection(updateVtkOutput, 'solver', outputVtk, 'solver');

	const pressure = new GetPressuresAtReceiversNode({factory});
	await editor.addNode(pressure);
	await editor.addExecConnection(logGatheringAndExportingSeismos, pressure);

	await editor.addNewConnection(initializeSolver, 'solver', pressure, 'solver');

	// return [foreachShot, logShotDone, logGatheringAndExportingSeismos, pressure];
	return editor.getNodes();
}
