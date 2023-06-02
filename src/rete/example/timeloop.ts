import { StartNode } from '../node/control/StartNode';
import { NodeEditor } from '../NodeEditor';
import { TimeLoopNode } from '../node/control/TimeLoopNode';
import { LogNode } from '../node/io/LogNode';
import { OutputVtkNode } from '../node/makutu/solver/OutputVtk';
import { EveryNode } from '../node/control/EveryNode';

export async function timeloopExample(editor: NodeEditor) {
	const start = new StartNode();
	await editor.addNode(start);

	const timeLoop = new TimeLoopNode();
	await editor.addNode(timeLoop);

	await editor.addExecConnection(start, timeLoop);

	const outputVtk = new OutputVtkNode();
	await editor.addNode(outputVtk);

	const every = new EveryNode();
	await editor.addNode(every);

	await editor.addNewConnection(timeLoop, 'loop', every, 'exec');
	await editor.addExecConnection(every, outputVtk);

	return editor.getNodes();
}
