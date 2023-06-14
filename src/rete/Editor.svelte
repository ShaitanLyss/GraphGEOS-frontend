<script lang="ts">
	import { AreaExtensions, AreaPlugin } from 'rete-area-plugin';
	import { onDestroy, onMount } from 'svelte';
	import {
		ClassicFlow,
		ConnectionPlugin,
		Presets as ConnectionPresets
	} from 'rete-connection-plugin';
	import { AutoArrangePlugin, Presets as ArrangePresets } from 'rete-auto-arrange-plugin';
	import { Node, setupMyTypes, process } from './node/Node';
	import type { AreaExtra } from './node/AreaExtra';
	import type { Schemes } from './node/Schemes';
	import { setupRender } from './customization/render';
	import { setupContextMenu } from './plugin/context-menu/context-menu';
	import { setupMinimap } from './plugin/minimap';
	import { TypedSocketsPlugin, isConnectionInvalid } from './plugin/typed-sockets';
	import type { Socket } from './socket/Socket';
	import { notifications } from '@mantine/notifications';
	import { NodeEditor } from './NodeEditor';
	
	const editor = new NodeEditor();
	export let loadExample: ((editor: NodeEditor) => Promise<Node[]>) | undefined = undefined;
	export let hidden = false;

	let container: HTMLDivElement;

	const arrange = new AutoArrangePlugin<Schemes>();
	const typedSocketsPlugin = new TypedSocketsPlugin<Schemes>();
	editor.use(typedSocketsPlugin);
	arrange.addPreset(ArrangePresets.classic.setup());

	async function setupEditor() {
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
			AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
				accumulating: AreaExtensions.accumulateOnCtrl()
			});

			// const nodesToFocus = await timeloopExample(editor);
			if (loadExample) {
				const nodesToFocus = await loadExample(editor);

				await arrange.layout();
				AreaExtensions.zoomAt(area, nodesToFocus);
			}

			AreaExtensions.simpleNodesOrder(area);
		}

		await createNodes();
		process();

		editor.addPipe((context) => {
			if (['connectioncreated', 'connectionremoved'].includes(context.type)) {
				process((context as unknown as { data: { target: Node } }).data.target);
			}

			
			
			return context;
		});

		await setupContextMenu(area);
		console.log('Editor setup');

		return () => area.destroy();
	}

	let destroyEditor: Function;

	onMount(async () => {
		destroyEditor = await setupEditor();
	});

	onDestroy(() => {
		if (destroyEditor) destroyEditor();
	});
</script>

<div {hidden} bind:this={container} style="border:4px solid violet; height:75vh;" />
