import { AreaExtensions, AreaPlugin } from 'rete-area-plugin';
import {
	ClassicFlow,
	ConnectionPlugin,
	Presets as ConnectionPresets
} from 'rete-connection-plugin';
import { AutoArrangePlugin, Presets as ArrangePresets } from 'rete-auto-arrange-plugin';
import { Node } from './node/Node';
import type { AreaExtra } from './node/AreaExtra';
import type { Schemes } from './node/Schemes';
import { TypedSocketsPlugin, isConnectionInvalid } from './plugin/typed-sockets';
import type { Socket } from './socket/Socket';
import { notifications } from '@mantine/notifications';
import { NodeEditor } from './NodeEditor';
import { EditorExample } from './example/types';
import { MegaSetup } from './setup/MegaSetup';
import { NodeFactory } from './node/NodeFactory';

export async function setupEditor(container: HTMLElement, loadExample?: EditorExample) {
	const editor = new NodeEditor();
	const arrange = new AutoArrangePlugin<Schemes>();
	const typedSocketsPlugin = new TypedSocketsPlugin<Schemes>();
	editor.use(typedSocketsPlugin);
	arrange.addPreset(ArrangePresets.classic.setup());

	const area = new AreaPlugin<Schemes, AreaExtra>(container);
	editor.use(area);

	// Setup node factory
	const nodeFactory = new NodeFactory(editor, area);

	// Setup react renderer
	const megaSetup = new MegaSetup();
	megaSetup.setup(editor, area, nodeFactory);

	area.use(arrange);
	AreaExtensions.showInputControl(area);

	const connection = new ConnectionPlugin<Schemes, AreaExtra>();
	ConnectionPresets.classic.setup();
	connection.addPreset(
		() =>
			new ClassicFlow({
				makeConnection(from, to, context) {
					const forward = from.side === 'output' && to.side === 'input';
					const backward = from.side === 'input' && to.side === 'output';
					const [source, target] = forward ? [from, to] : backward ? [to, from] : [];

					if (!source || !target) return false;
					editor.addNewConnection(
						editor.getNode(source.nodeId),
						source.key,
						editor.getNode(target.nodeId),
						target.key
					);
					return true;
				},
				canMakeConnection(from, to) {
					connection.drop();
					// this function checks if the old connection should be removed
					if (
						isConnectionInvalid(
							(from as unknown as { payload: Socket }).payload,
							(to as unknown as { payload: Socket }).payload
						)
					) {
						console.log(
							`Connection between ${from.nodeId} and ${to.nodeId} is not allowed. From socket type is ${from.payload.type} and to socket type is ${to.payload.type}`
						);
						notifications.show({
							title: 'Erreur',
							message: `Connection invalide entre types "${from.payload.type}" et "${to.payload.type}" !`,
							color: 'red'
						});
						return false;
					} else return true;
				}
			})
	);

	connection.addPreset(ConnectionPresets.classic.setup());
	area.use(connection);

	AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
		accumulating: AreaExtensions.accumulateOnCtrl()
	});

	let nodesToFocus: Node[] = [];
	if (loadExample) {
		nodesToFocus = await loadExample(nodeFactory);
		await arrange.layout();
	}

	AreaExtensions.simpleNodesOrder(area);
	// await AreaExtensions.zoomAt(area, nodesToFocus);

	nodeFactory.process();

	editor.addPipe((context) => {
		if (['connectioncreated', 'connectionremoved'].includes(context.type)) {
			nodeFactory.process((context as unknown as { data: { target: Node } }).data.target);
		}

		return context;
	});

	console.log('Editor setup');

	return {
		destroy: () => area.destroy(),
		firstDisplay: async () => {
			await arrange.layout();
			AreaExtensions.zoomAt(area, nodesToFocus);
		},
		editor,
		factory: nodeFactory
	};
}
