<script lang="ts">
	import { onMount } from 'svelte';
	import { modeCurrent } from '@skeletonlabs/skeleton';
	// import Ref from '../../../Ref.svelte';
	// import type { ClassicScheme, SvelteArea2D } from '../types';
	import { ClassicScheme, Ref, SvelteArea2D } from 'rete-svelte-plugin';
	import { MacroNode } from '$rete/node/MacroNode';
	import { faCubes } from '@fortawesome/free-solid-svg-icons';
	import type { Node, NodeEditorSaveData } from '$rete';
	import Fa from 'svelte-fa';
	import { EditMacroNodeChannel } from '$lib/broadcast-channels';
	import { GetGraphStore } from '$houdini';
	type NodeExtraData = { width?: number; height?: number };

	function sortByIndex<K, I extends undefined | { index?: number }>(entries: [K, I][]) {
		entries.sort((a, b) => {
			const ai = (a[1] && a[1].index) || 0;
			const bi = (b[1] && b[1].index) || 0;
			return ai - bi;
		});
		return entries as [K, Exclude<I, undefined>][];
	}

	export let data: Node & NodeExtraData;
	$: node = data;
	$: macroNode = data instanceof MacroNode ? data : undefined;

	const isMacroNode = data instanceof MacroNode;
	// console.log('isMacroNode', isMacroNode);
	export let emit: (props: SvelteArea2D<ClassicScheme>) => void;

	$: width = Number.isFinite(data.width) ? `${data.width}px` : '';
	$: height = Number.isFinite(data.height) ? `${data.height}px` : '';

	$: inputs = sortByIndex(Object.entries(data.inputs));
	$: controls = sortByIndex(Object.entries(data.controls));
	$: outputs = sortByIndex(Object.entries(data.outputs));
	function any<T>(arg: T): unknown {
		return arg;
	}

	async function onDblClickNode() {
		console.log('Double click on node');
		if (macroNode === undefined) return;
		console.log('Double click on macro node');
		const graph = (await new GetGraphStore().fetch({ variables: { id: macroNode.graphId } })).data
			?.graph;
		if (graph === undefined) throw new Error('Graph not found');
		const saveData: NodeEditorSaveData = JSON.parse(graph.data);
		new EditMacroNodeChannel().postMessage({
			graph: saveData
		});
	}
</script>

<div
	class="node {data.selected ? 'selected' : ''}"
	style:width
	style:height
	data-testid="node"
	class:bg-surface-500={!$modeCurrent}
	class:node-light-background={$modeCurrent}
>
	<div class="flex justify-between items-center">
		<div class="title" data-testid="title">{data.label}</div>
		{#if isMacroNode}
			<div
				class="p-2 text-surface-50-900-token"
				on:dblclick|preventDefault={onDblClickNode}
				on:pointerdown|stopPropagation
				role="button"
				tabindex="0"
			>
				<Fa icon={faCubes} />
			</div>
		{/if}
	</div>
	<!-- Outputs -->
	{#each outputs as [key, output]}
		<div class="output" data-testid={'output-' + key}>
			<div class="output-title" data-testid="output-title">
				{output.label || ''}
			</div>
			<Ref
				class="output-socket"
				data-testid="output-socket"
				init={(element) =>
					emit({
						type: 'render',
						data: {
							type: 'socket',
							side: 'output',
							key,
							nodeId: data.id,
							element,
							payload: output.socket
						}
					})}
				unmount={(ref) => emit({ type: 'unmount', data: { element: ref } })}
			/>
		</div>
	{/each}

	<!-- Controls -->
	{#each controls as [key, control]}
		<Ref
			class="control"
			data-testid={'control-' + key}
			init={(element) =>
				emit({
					type: 'render',
					data: {
						type: 'control',
						element,
						payload: control
					}
				})}
			unmount={(ref) => emit({ type: 'unmount', data: { element: ref } })}
		/>
	{/each}

	<!-- Inputs -->
	{#each inputs as [key, input]}
		<div class="rete-input" data-testid={'input-' + key}>
			<Ref
				class="input-socket"
				data-testid="input-socket"
				init={(element) =>
					emit({
						type: 'render',
						data: {
							type: 'socket',
							side: 'input',
							key,
							nodeId: data.id,
							element,
							payload: input.socket
						}
					})}
				unmount={(ref) => emit({ type: 'unmount', data: { element: ref } })}
			/>
			{#if !input.control || !input.showControl}
				<div class="input-title" data-testid="input-title">
					{input.label || ''}
				</div>
			{/if}
			{#if input.control && input.showControl}
				<Ref
					class="input-control"
					data-testid="input-control"
					init={(element) =>
						emit({
							type: 'render',
							data: {
								type: 'control',
								element,
								payload: any(input).control
							}
						})}
					unmount={(ref) => emit({ type: 'unmount', data: { element: ref } })}
				/>
			{/if}
		</div>
	{/each}
</div>

<style lang="scss">
	@use 'sass:math';
	@import '../vars';

	.node-light-background {
		background: $node-color;
	}

	.node {
		border: 2px solid #4e58bf;
		border-radius: 10px;
		cursor: pointer;
		box-sizing: border-box;
		width: $node-width;
		height: auto;
		padding-bottom: 6px;
		position: relative;
		user-select: none;
		line-height: initial;
		font-family: Arial;
		transition: transform 0.1s;

		&.dark {
			background: darken($node-color, 4%);
		}

		&:hover {
			background: lighten($node-color, 4%);
		}

		&.selected {
			background: $node-color-selected;
			border-color: #e3c000;
		}

		.title {
			color: white;
			font-family: sans-serif;
			font-size: 18px;
			padding: 8px;
		}

		.output {
			text-align: right;
		}

		.input {
			text-align: left;
		}

		:global(.output-socket) {
			text-align: right;
			margin-right: -(math.div($socket-size, 2) + $socket-margin);
			display: inline-block;
		}

		:global(.input-socket) {
			text-align: left;
			margin-left: -(math.div($socket-size, 2) + $socket-margin);
			display: inline-block;
		}

		.input-title,
		.output-title {
			vertical-align: middle;
			color: white;
			display: inline-block;
			font-family: sans-serif;
			font-size: 14px;
			margin: $socket-margin;
			line-height: $socket-size;
		}

		:global(.input-control) {
			z-index: 1;
			width: calc(100% - #{$socket-size + 2 * $socket-margin});
			vertical-align: middle;
			display: inline-block;
		}

		:global(.control) {
			display: block;
			padding: $socket-margin math.div($socket-size, 2) + $socket-margin;
		}
	}
</style>
