import { AreaExtensions, AreaPlugin } from 'rete-area-plugin';
import {
	ClassicFlow,
	ConnectionPlugin,
	Presets as ConnectionPresets
} from 'rete-connection-plugin';
import { AutoArrangePlugin, Presets as ArrangePresets } from 'rete-auto-arrange-plugin';
import type { Node } from './node/Node';
import type { AreaExtra } from './node/AreaExtra';
import type { Schemes } from './node/Schemes';
import { TypedSocketsPlugin, isConnectionInvalid } from './plugin/typed-sockets';
import type { Socket } from './socket/Socket';
import { notifications } from '@mantine/notifications';
import { NodeEditor, NodeEditorSaveData } from './NodeEditor';
import type { EditorExample } from './example/types';
import { MegaSetup } from './setup/MegaSetup';
import { NodeFactory } from './node/NodeFactory';
import type { MakutuClasses, MakutuClasses$result } from '$houdini';
import type { MakutuClassRepository } from '../backend-interaction/types';

export async function setupEditor(
	container: HTMLElement,
	makutuClasses: MakutuClassRepository,
	loadExample?: EditorExample,
	saveData?: NodeEditorSaveData
) {
	if (container === null) throw new Error('Container is null');
	const editor = new NodeEditor();
	const arrange = new AutoArrangePlugin<Schemes>();
	const typedSocketsPlugin = new TypedSocketsPlugin<Schemes>();
	editor.use(typedSocketsPlugin);
	arrange.addPreset(ArrangePresets.classic.setup());

	const area = new AreaPlugin<Schemes, AreaExtra>(container);
	editor.use(area);

	// Setup node factory
	const nodeFactory = new NodeFactory({ editor, area, makutuClasses });

	// Setup react renderer
	const megaSetup = new MegaSetup();
	megaSetup.setup(editor, area, nodeFactory);

	area.use(arrange);
	AreaExtensions.showInputControl(area);

	AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
		accumulating: AreaExtensions.accumulateOnCtrl()
	});

	let nodesToFocus: Node[] = [];
	let isExample = false;
	if (loadExample && saveData === undefined) {
		isExample = true;
		nodesToFocus = await loadExample(nodeFactory);
		await arrange.layout();
	}

	if (saveData) {
		await nodeFactory.loadGraph(saveData);
		nodesToFocus = editor.getNodes();
	}

	AreaExtensions.simpleNodesOrder(area);
	// await AreaExtensions.zoomAt(area, nodesToFocus);

	console.log('Editor setup');

	return {
		destroy: () => area.destroy(),
		firstDisplay: async () => {
			nodeFactory.dataflowEngine.reset();
			nodeFactory.process();
			editor.addPipe((context) => {
				if (['connectioncreated', 'connectionremoved'].includes(context.type)) {
					try {
						nodeFactory.process((context as unknown as { data: { target: Node } }).data.target);
					} catch (e) {}
				}

				return context;
			});
			// if (isExample)
			// 	await arrange.layout();
			await AreaExtensions.zoomAt(area, nodesToFocus);
		},
		editor,
		factory: nodeFactory
	};
}
