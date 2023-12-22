import { AreaExtensions, AreaPlugin } from 'rete-area-plugin';
import { AutoArrangePlugin, Presets as ArrangePresets } from 'rete-auto-arrange-plugin';
import type { Node } from './node/Node';
import type { AreaExtra } from './node/AreaExtra';
import type { Schemes } from './node/Schemes';
import { TypedSocketsPlugin } from './plugin/typed-sockets';
import { NodeEditor, type NodeEditorSaveData } from './NodeEditor';
import type { EditorExample } from './example/types';
import { MegaSetup } from './setup/MegaSetup';
import { NodeFactory } from './node/NodeFactory';
import type { MakutuClassRepository } from '$lib/backend-interaction/types';

export async function setupEditor({
	container,
	makutuClasses,
	loadExample,
	saveData
}: {
	container: HTMLElement;
	makutuClasses: MakutuClassRepository;
	loadExample?: EditorExample;
	saveData?: NodeEditorSaveData;
}) {
	if (container === null) throw new Error('Container is null');
	const editor = new NodeEditor();
	const typedSocketsPlugin = new TypedSocketsPlugin<Schemes>();
	editor.use(typedSocketsPlugin);
	const arrange = new AutoArrangePlugin<Schemes>();
	arrange.addPreset(ArrangePresets.classic.setup());

	const area = new AreaPlugin<Schemes, AreaExtra>(container);
	editor.use(area);

	const selector = AreaExtensions.selector();
	const accumulating = AreaExtensions.accumulateOnCtrl();

	// Setup node factory
	const nodeFactory = new NodeFactory({ editor, area, makutuClasses, selector });

	// Setup react renderer
	const megaSetup = new MegaSetup();
	megaSetup.setup(editor, area, nodeFactory);

	area.use(arrange);
	AreaExtensions.showInputControl(area);
	AreaExtensions.selectableNodes(area, selector, {
		accumulating
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
				if (context.type === 'connectioncreated' || context.type === 'connectionremoved') {
					const conn = context.data;
					console.log('resetting node', conn.target);
					nodeFactory.dataflowEngine.reset(conn.target);
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
