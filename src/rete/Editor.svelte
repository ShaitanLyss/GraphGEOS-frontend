<script lang="ts">
	import { NodeEditor } from 'rete';
	import { AreaExtensions, AreaPlugin } from 'rete-area-plugin';
	import { onMount } from 'svelte';
	import {
		ClassicFlow,
		ConnectionPlugin,
		Presets as ConnectionPresets
	} from 'rete-connection-plugin';
	import { AddNode } from './node/math/AddNode';
	import { AutoArrangePlugin, Presets as ArrangePresets } from 'rete-auto-arrange-plugin';
	import { Node, Connection, setupMyTypes, process, controlflowEngine } from './node/Node';
	import { NumberNode } from './node/math/NumberNode';
	import { DisplayNode } from './node/math/DisplayNode';
	import type { AreaExtra } from './node/AreaExtra';
	import type { Schemes } from './node/Schemes';
	import { ProblemNode } from './node/makutu/ProblemNode';
	import { setupRender } from './customization/render';
	import { setupContextMenu } from './plugin/context-menu/context-menu';
	import { setupMinimap } from './plugin/minimap';
	import { StartNode } from './node/control/StartNode';
	import { TypedSocketsPlugin, isConnectionInvalid } from './plugin/typed-sockets';
	import { LogNode } from './node/io/LogNode';
	import { MakeArrayNode } from './node/data/MakeArrayNode';
	import { ForEachNode } from './node/control/ForEachNode';
	import type { Socket } from './socket/Socket';
	import { notifications } from '@mantine/notifications';

	const editor = new NodeEditor<Schemes>();

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
			const numberNode = new NumberNode(2);
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

			// editor.addNode(numberNode);

			// const addNode = new AddNode({ b: 3 });
			// await editor.addNode(addNode);
			// await editor.addNode(new ProblemNode());

			// await editor.addConnection(new Connection(numberNode, 'value', addNode, 'left'));

			// const displayNode = new DisplayNode(3);
			// await editor.addNode(displayNode);
			// await editor.addConnection(new Connection(addNode, 'value', displayNode, 'input'));

			const start = new StartNode();
			await editor.addNode(start);

			const log = new LogNode({ message: "Hello I'll show you some numbers" });
			await editor.addNode(log);

			await editor.addConnection(new Connection(start, 'exec', log, 'exec'));
			const makeArray = new MakeArrayNode();
			await editor.addNode(makeArray);
			makeArray.addPin();
			makeArray.addPin();
			const number1 = new NumberNode(1);
			await editor.addNode(number1);
			const number2 = new NumberNode(2);
			await editor.addNode(number2);
			const number3 = new NumberNode(3);
			await editor.addNode(number3);
			await editor.addConnection(new Connection(number1, 'value', makeArray, 'data-0'));
			await editor.addConnection(new Connection(number2, 'value', makeArray, 'data-1'));
			await editor.addConnection(new Connection(number3, 'value', makeArray, 'data-2'));

			const forEach = new ForEachNode();
			await editor.addNode(forEach);
			await editor.addConnection(new Connection(makeArray, 'array', forEach, 'array'));
			await editor.addConnection(new Connection(log, 'exec', forEach, 'exec'));
			const logItem = new LogNode({});
			await editor.addNode(logItem);
			await editor.addConnection(new Connection(forEach, 'item', logItem, 'message'));
			await editor.addConnection(new Connection(forEach, 'loop', logItem, 'exec'));
			const logEnd = new LogNode({ message: "I'm done!" });
			await editor.addNode(logEnd);
			await editor.addConnection(new Connection(forEach, 'exec', logEnd, 'exec'));

			connection.addPreset(ConnectionPresets.classic.setup());
			area.use(connection);

			AreaExtensions.zoomAt(area, editor.getNodes());

			AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
				accumulating: AreaExtensions.accumulateOnCtrl()
			});

			await arrange.layout();
			AreaExtensions.simpleNodesOrder(area);

			AreaExtensions.zoomAt(area, editor.getNodes());
		}

		createNodes();

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
