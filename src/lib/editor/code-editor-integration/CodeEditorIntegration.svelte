<script lang="ts">
	import { CodeEditorComponent, type ICodeEditor } from '$lib/code-editor';
	import { faArrowDown, faArrowRight } from '@fortawesome/free-solid-svg-icons';
	import type { EditorContext } from '..';
	import { get } from 'svelte/store';
	import CodeEditorIntegrationButton from './CodeEditorIntegrationButton.svelte';
	import { notifications } from '@mantine/notifications';
	import { ErrorWNotif, getContext } from '$lib/global';
	import 'regenerator-runtime/runtime';
	import wu from 'wu';
	import { _ } from '$lib/global';
	import { XmlNode } from '$rete/node/XML/XmlNode';
	import { structures } from 'rete-structures';
	import { parseXml, type ParsedXmlNodes, mergeParsedXml, buildXml, formatXml } from '$utils/xml';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import CodeEditor from '$lib/code-editor/CodeEditor.svelte';

	export let editorContext: EditorContext;
	let codeEditorPromise: Promise<ICodeEditor>;

	const cursorTag = 'cursorPositioooon';

	const geosContext = getContext('geos');

	async function pull() {
		const codeEditor = await codeEditorPromise;
		const factory = editorContext.getActiveFactory();

		if (!factory) throw new ErrorWNotif('No active editor');
		const editor = factory.getEditor();
		const selectedXmlNodes = wu(factory.selector.entities.values())
			.map((selected) => editor.getNode(selected.id))
			.filter((node) => node instanceof XmlNode)
			.reduce<Set<XmlNode>>((acc, node) => acc.add(node as XmlNode), new Set());

		const { text, cursorOffset } = codeEditor.getText();
		let preppedText = text;
		if (cursorOffset !== null)
			preppedText = text.slice(0, cursorOffset) + `<${cursorTag}/>` + text.slice(cursorOffset);

		const baseXml = parseXml(preppedText);
		let res: ParsedXmlNodes = baseXml;

		const xmlMergingPromises = wu(factory.selector.entities.values())
			.map((selected) => editor.getNode(selected.id))
			.filter((node) => node instanceof XmlNode)
			// Take only the selected nodes that are not predecessors
			// of other selected nodes because they are redundant
			.filter((node) =>
				wu(structures(editor).successors(node.id).nodes().values())
					.filter((node) => node instanceof XmlNode)
					.every((node) => !selectedXmlNodes.has(node as XmlNode))
			)
			.map(async (node) => {
				const xml = parseXml(await (node as XmlNode).getXml());
				res = mergeParsedXml({ baseXml: res, newXml: xml, cursorTag, geosContext });
			});
		await Promise.all(xmlMergingPromises);

		codeEditor.setText({ text: buildXml({ parsedXml: res, cursorTag }) });
	}
	function push() {
		notifications.show({ message: 'Push' });
	}
	async function download() {
		const codeEditor = await codeEditorPromise;
		const factory = editorContext.getActiveFactory();

		if (!factory) throw new ErrorWNotif('No active editor');
		const editor = factory.getEditor();
		let somethingToDownload = false;

		const selectedCode = codeEditor.getSelectedText();
		if (selectedCode) {
			somethingToDownload = true;
			const element = document.createElement('a');

			element.setAttribute(
				'href',
				'data:text/plain;charset=utf-8,' + encodeURIComponent(selectedCode)
			);
			element.setAttribute('download', 'codeEditor.xml');

			element.style.display = 'none';
			document.body.appendChild(element);

			element.click();

			document.body.removeChild(element);
		}

		const promises = wu(factory.selector.entities.values())
			.map((selected) => editor.getNode(selected.id))
			.filter((node) => node instanceof XmlNode)
			.map(async (node) => {
				somethingToDownload = true;
				const xml = await (node as XmlNode).getXml();
				const element = document.createElement('a');

				element.setAttribute(
					'href',
					'data:text/plain;charset=utf-8,' + encodeURIComponent(formatXml({ xml }))
				);
				element.setAttribute('download', `${node.label}.xml`);

				element.style.display = 'none';
				document.body.appendChild(element);

				element.click();

				document.body.removeChild(element);
			});
		await Promise.all(promises);
		if (!somethingToDownload)
			notifications.show({
				autoClose: 6000,
				title: $_('code-editor-integration.button.download.notification.title'),
				color: 'orange',
				message: $_('code-editor-integration.button.download.notification.nothing-selected.message')
			});
	}
</script>

<div class="absolute h-full top-0 -translate-x-1/2 z-10 nope-pt-[2.64rem] pointer-events-none">
	{#await codeEditorPromise then}
		<div class="h-full flex flex-col gap-2 justify-center pointer-events-none">
			<CodeEditorIntegrationButton icon={faArrowRight} flip={'horizontal'} on:click={push} />
			<CodeEditorIntegrationButton icon={faArrowRight} on:click={pull} />
			<CodeEditorIntegrationButton icon={faArrowDown} on:click={download} />
		</div>
	{/await}
</div>
<CodeEditorComponent
	bind:codeEditorPromise
	width="40vw"
	border="border-s-2 border-surface-100-800-token"
/>
