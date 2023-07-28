<script lang="ts">
	import type { NodeFactory } from '$rete/node/NodeFactory';
	import { faPython } from '@fortawesome/free-brands-svg-icons';
	import EditorButton from './EditorButton.svelte';
	import { notifications } from '@mantine/notifications';
	import { _ } from 'svelte-i18n';
	import type { Root } from 'rete';
	import type { Area2D } from 'rete-area-plugin';
	import type { AreaExtra } from '$rete/node/AreaExtra';
	import type { Schemes } from '$rete/node/Schemes';

	export let factory: NodeFactory;
	export let container: HTMLElement;

	let active = false;
	$: window.factory = factory;

	$: if (active) {
		notifications.show({
			title: $_('python-mode.notification.title'),
			message: $_('python-mode.notification.description'),
			color: 'blue',
			id: 'python-mode',
			autoClose: false,
			withCloseButton: false
		});
	} else {
		notifications.hide('python-mode');
	}

	$: if (factory) {
		const editor = factory.getEditor();
		const pipe = async (context: AreaExtra | Area2D<Schemes> | Root<Schemes>) => {
			if (active && context.type === 'nodepicked') {
				const nodeId = context.data.id;
				const node = editor.getNode(nodeId);
				const res = await node.pythonComponent.toPython();
				console.log(res);
				// Download res as file
				const blob = new Blob([res], { type: 'text/plain' });
				const url = URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = 'script.py';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);

				notifications.show({
					title: $_('python-mode.notification.title'),
					message: $_('python-mode.generation.success.message'),
					color: 'green'
				});
				togglePythonMode();
			}
		};

		factory.setState('toPythonBtn', 'pipeFunction', pipe);
		// console.log(import.meta)

		if (!factory.getState('toPythonBtn', 'pipeAdded', false)) {
			factory.setState('toPythonBtn', 'pipeAdded', true);

			const area = factory.getArea();
			const editor = factory.getEditor();
			console.log('adding area pipe');

			area.addPipe(async (context) => {
				factory.getState<(context: AreaExtra | Area2D<Schemes> | Root<Schemes>) => void>(
					'toPythonBtn',
					'pipeFunction'
				)(context);
				return context;
			});
		}
	}

	function togglePythonMode() {
		container.classList.toggle('python-cursor');
		active = !active;
	}
</script>

<EditorButton icon={faPython} on:click={togglePythonMode} {active} />
