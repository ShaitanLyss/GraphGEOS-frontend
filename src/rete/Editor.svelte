<script lang="ts">
	import { AreaExtensions, AreaPlugin } from 'rete-area-plugin';
	import { onMount } from 'svelte';
	import {
		ClassicFlow,
		ConnectionPlugin,
		Presets as ConnectionPresets
	} from 'rete-connection-plugin';
	import { AutoArrangePlugin, Presets as ArrangePresets } from 'rete-auto-arrange-plugin';
	import { Node, setupMyTypes, process } from './node/Node';
	import { NumberNode } from './node/math/NumberNode';
	import type { AreaExtra } from './node/AreaExtra';
	import type { Schemes } from './node/Schemes';
	import { setupRender } from './customization/render';
	import { setupContextMenu } from './plugin/context-menu/context-menu';
	import { setupMinimap } from './plugin/minimap';
	import { TypedSocketsPlugin, isConnectionInvalid } from './plugin/typed-sockets';
	import type { Socket } from './socket/Socket';
	import { notifications } from '@mantine/notifications';
	import { acquisitionModelingExample } from './example/acquisition-modelling';

	import { NodeEditor } from './NodeEditor';
	import { timeloopExample } from './example/timeloop';

	const editor = new NodeEditor();

	let container: HTMLDivElement;

	const arrange = new AutoArrangePlugin<Schemes>();
	const typedSocketsPlugin = new TypedSocketsPlugin<Schemes>();
	editor.use(typedSocketsPlugin);
	arrange.addPreset(ArrangePresets.classic.setup());

	onMount(async () => {
		const area = new AreaPlugin<Schemes, AreaExtra>(container);
		editor.use(area);

		setupRender(editor, area);
		setupMinimap(area);
		setupMyTypes(area, editor);

		area.use(arrange);
		AreaExtensions.showInputControl(area);

		async function createNodes() {
			const connection = new ConnectionPlugin<Schemes, AreaExtra>();
			ConnectionPresets.classic.setup();
			connection.addPreset(
				() =>
					new ClassicFlow({
						canMakeConnection(from, to) {
							connection.drop();
							// this function checks if the old connection should be removed
							if (
								isConnectionInvalid(
									(from as unknown as { payload: Socket }).payload,
									(to as unknown as { payload: Socket }).payload
								)
							) {
								notifications.show({
									title: 'Erreur',
									message: 'Connection invalide !',
									color: 'red'
								});
								return false;
							} else return true;
						}
					})
			);

			connection.addPreset(ConnectionPresets.classic.setup());
			area.use(connection);

			// const nodesToFocus = await timeloopExample(editor);
			const nodesToFocus = await acquisitionModelingExample(editor);

			AreaExtensions.zoomAt(area, editor.getNodes());

			AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
				accumulating: AreaExtensions.accumulateOnCtrl()
			});

			await arrange.layout();

			AreaExtensions.simpleNodesOrder(area);

			AreaExtensions.zoomAt(area, nodesToFocus);
		}

		await createNodes();

		editor.addPipe((context) => {
			if (['connectioncreated', 'connectionremoved'].includes(context.type)) {
				process((context as unknown as { data: { target: Node } }).data.target);
			}

			return context;
		});

		await setupContextMenu(area);

		return () => area.destroy();
	});
</script>

<div bind:this={container} style="border:4px solid violet; height:75vh;" />
