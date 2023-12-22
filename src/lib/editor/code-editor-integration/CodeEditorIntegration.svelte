<script lang="ts">
	import { CodeEditorComponent, type ICodeEditor } from '$lib/code-editor';
	import { faArrowDown, faArrowRight } from '@fortawesome/free-solid-svg-icons';
	import type { EditorContext } from '..';
	import { get } from 'svelte/store';
	import CodeEditorIntegrationButton from './CodeEditorIntegrationButton.svelte';
	import { notifications } from '@mantine/notifications';
	import { ErrorWNotif, getContext } from '$lib/global';
	import { getLeavesFromOutput } from '$rete/node/utils';
	import 'regenerator-runtime/runtime';
	import wu from 'wu';
	import type { Node } from '$rete';
	import { XmlNode } from '$rete/node/XML/XmlNode';
	import { structures } from 'rete-structures';
	import { parseXml, type ParsedXmlNodes, mergeParsedXml, buildXml } from '$utils/xml';

	export let editorContext: EditorContext;
	let codeEditorPromise: Promise<ICodeEditor>;

	const cursorTag = 'cursorPositioooon';

	const geosSchemaContext = getContext('geos');

	async function pull() {
		const codeEditor = await codeEditorPromise;
		const factory = editorContext.getActiveFactory();

		if (!factory) throw new ErrorWNotif('No active editor');
		const editor = factory.getEditor();
		const selectedXmlNodes = wu(factory.selector.entities.values())
			.map((selected) => editor.getNode(selected.id))
			.filter((node) => node instanceof XmlNode)
			.reduce<Set<XmlNode>>((acc, node) => acc.add(node as XmlNode), new Set());

		const typesTree = get(geosSchemaContext.typesTree);
		if (!typesTree) throw new ErrorWNotif('Failed to load types tree');
		const { text, cursorOffset } = codeEditor.getText();
		let preppedText = text;
		if (cursorOffset !== null)
			preppedText = text.slice(0, cursorOffset) + `<${cursorTag}/>` + text.slice(cursorOffset);

		const baseXml = parseXml(preppedText);
		console.log('typesTree', typesTree);

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
				res = mergeParsedXml({ baseXml: res, newXml: xml, cursorTag, typesTree });
			});
		await Promise.all(xmlMergingPromises);

		codeEditor.setText({ text: buildXml({ parsedXml: res, cursorTag }) });
	}
	function push() {
		notifications.show({ message: 'Push' });
	}
	function download() {
		notifications.show({ message: 'Download' });
	}
</script>

<div class="absolute h-full top-0 -translate-x-1/2 z-10 nope-pt-[2.64rem] pointer-events-none">
	<div class="h-full flex flex-col gap-2 justify-center pointer-events-none">
		<CodeEditorIntegrationButton icon={faArrowRight} flip={'horizontal'} on:click={push} />
		<CodeEditorIntegrationButton icon={faArrowRight} on:click={pull} />
		<CodeEditorIntegrationButton icon={faArrowDown} on:click={download} />
	</div>
</div>
<CodeEditorComponent
	bind:codeEditorPromise
	width="40vw"
	border="border-s-2 border-surface-100-800-token"
/>
