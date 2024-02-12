<script lang="ts">
	import { CodeEditorComponent, type ICodeEditor } from '$lib/code-editor';
	import { faArrowDown, faArrowRight } from '@fortawesome/free-solid-svg-icons';
	import type { EditorContext } from '..';
	import CodeEditorIntegrationButton from './CodeEditorIntegrationButton.svelte';
	import { notifications } from '@mantine/notifications';
	import { ErrorWNotif, getContext } from '$lib/global';
	import 'regenerator-runtime/runtime';
	import wu from 'wu';
	import { _ } from '$lib/global';
	import { structures } from 'rete-structures';
	import {
		parseXml,
		type ParsedXmlNodes,
		mergeParsedXml,
		buildXml,
		formatXml,
		getElementFromParsedXml,
		getXmlAttributes
	} from '$utils/xml';
	import { AutoArrangePlugin, Presets as ArrangePresets } from 'rete-auto-arrange-plugin';
	import type { Schemes } from '$rete/node/Schemes';
	import type { Node } from '$rete';
	import { Area, AreaExtensions, AreaPlugin, NodeView } from 'rete-area-plugin';
	import type { AreaExtra } from '$rete/node/AreaExtra';
	import { XmlNode } from '$rete/node/XML/XmlNode';
	import type { GeosSchema } from '$lib/geos';
	import { get } from 'svelte/store';

	export let editorContext: EditorContext;
	let codeEditorPromise: Promise<ICodeEditor>;

	const cursorTag = 'cursorPositioooon';

	const geosContext = getContext('geos');
	const newGeosContext = getContext('geos_v2');

	async function pull() {
		const codeEditor = await codeEditorPromise;
		const factory = editorContext.getActiveFactory();

		if (!factory) throw new ErrorWNotif('No active editor');
		const editor = factory.getEditor();
		if (!factory?.selector) throw new ErrorWNotif('No selector');
		const selectedXmlNodes = wu(factory.selector.entities.values())
			.map((selected) => editor.getNode(selected.id))
			.filter((node) => node instanceof XmlNode)
			.reduce<Set<XmlNode>>((acc, node) => acc.add(node as XmlNode), new Set());

		const { text, cursorOffset } = codeEditor.getText();
		let preppedText = text;
		// if (cursorOffset !== null)
		// 	preppedText = text.slice(0, cursorOffset) + `<${cursorTag}/>` + text.slice(cursorOffset);

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
	async function push() {
		const { NodeEditor, NodeFactory } = await import('$rete');
		const geosSchema = newGeosContext.geosSchema;

		const factory = editorContext.getActiveFactory();
		if (!factory) throw new ErrorWNotif('No active editor');
		const editor = factory.getEditor();

		const codeEditor = await codeEditorPromise;
		const selectedText = codeEditor.getSelectedText();
		const full_xml = parseXml(selectedText);

		const tmp_editor = new NodeEditor();
		const tmp_container = document.createElement('div');
		const tmp_area = new AreaPlugin<Schemes, AreaExtra>(tmp_container);
		tmp_editor.use(tmp_area);

		const arrange = new AutoArrangePlugin<Schemes>();
		arrange.addPreset(ArrangePresets.classic.setup());
		tmp_area.use(arrange);

		const tmp_factory = new NodeFactory({
			editor: tmp_editor,
			area: tmp_area
		});

		async function xmlToEditor(xml: ParsedXmlNodes, schema: GeosSchema, parent?: Node) {
			for (const xmlNode of xml) {
				const name = getElementFromParsedXml(xmlNode);
				const complexType = schema.complexTypes.get(name);
				if (!complexType) {
					console.warn('Complex type not found');
					continue;
				}
				const hasNameAttribute = complexType.attributes.has('name');
				const xmlAttributes = getXmlAttributes(xmlNode as Record<string, ParsedXmlNodes>);
				const node = await tmp_factory.addNode(XmlNode, {
					label: name,
					initialValues: xmlAttributes,
					xmlConfig: {
						noName: !hasNameAttribute,
						childTypes: complexType.childTypes.map((childType) => {
							const childName = childType.match(/^(.*)Type$/)?.at(1);
							if (!childName) return childType;
							return childName;
						}),
						xmlTag: name,
						outData: {
							name: name,
							type: `xmlElement:${name}`,
							socketLabel: name
						},

						xmlProperties: wu(complexType.attributes.values())
							.map((attr) => {
								return {
									name: attr.name,
									required: attr.required,
									// pattern: attr.pattern,
									type: attr.type,
									controlType: 'text'
								};
							})
							.toArray()
					}
				});
				if (parent) {
					console.log('node', node, 'parent', parent);
					const conn = await tmp_editor.addNewConnection(node, 'value', parent, 'children');
					console.log('temp conn', conn);
				}
				await xmlToEditor((xmlNode as Record<string, ParsedXmlNodes>)[name], schema, node);
			}
		}
		console.log('Download: full_xml', full_xml);
		await xmlToEditor(full_xml, geosSchema);
		console.log(await arrange.layout());
		const area = factory.getArea();
		let leftBound = 0;
		if (area) {
			wu(area.nodeViews.values()).forEach((nodeView) => {
				leftBound = Math.min(leftBound, nodeView.position.x - nodeView.element.offsetWidth * 1.4);
			});
		}

		for (const [i, node] of tmp_editor.getNodes().entries()) {
			await editor.addNode(node);
			const tmp_nodeView = tmp_area.nodeViews.get(node.id) as NodeView;
			node.setFactory(factory);
			const nodeView = factory.getArea()?.nodeViews.get(node.id);
			factory.selectableNodes?.select(node.id, i !== 0);
			if (nodeView)
				await nodeView.translate(tmp_nodeView.position.x + leftBound, tmp_nodeView.position.y);
			await factory.getArea()?.update('node', node.id);
		}
		notifications.show({
			title: get(_)('graph-editor.notification.title'),
			message: get(_)('code-editor-integration.push-to-graph.selected-node-dragging.message'),
			autoClose: 7000
		});

		for (const conn of tmp_editor.getConnections()) {
			await editor.addConnection(conn);
		}
		if (area) await AreaExtensions.zoomAt(area, editor.getNodes(), {});
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
			element.setAttribute('download', 'geos.xml');

			element.style.display = 'none';
			document.body.appendChild(element);

			element.click();

			document.body.removeChild(element);
		}
		if (!factory?.selector) throw new ErrorWNotif('No selector');
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