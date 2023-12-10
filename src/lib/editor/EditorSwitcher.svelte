<script lang="ts">
	import { Editor, EditorSharedOverlay } from '$lib/editor';
	import { setContext, notifications, getContext } from '$lib/global';
	import type { TabProps } from '$lib/layout';
	import type { NodeFactory } from '$rete';
	import type { EditorExample } from '$rete/example';
	import { newUniqueId } from '$utils';
	import { modeCurrent } from '@skeletonlabs/skeleton';
	import { onDestroy, onMount } from 'svelte';

	let factories: NodeFactory[] = [];
	let examples: EditorExample[] = [];
	let container: HTMLElement;
	let activeFactory: NodeFactory | undefined;

	onMount(async () => {
		const { forEachExample } = await import('$rete/example');
		examples.push(forEachExample);
		examples = examples;
	});

	setContext('editor', {
		getEditorViewport: () => container,
		getActiveFactory: () => activeFactory
	});

	setContext('onSave', () =>
		notifications.show({ title: 'Saved', message: 'TODO', color: 'green' })
	);

	const tabsContext = getContext('tabs');

	$: tabs = tabsContext?.tabs;

	$: if (tabsContext?.tabs !== undefined) {
		const res: TabProps[] = factories.map((factory) => {
			const e = factory.getEditor();
			return {
				id: factory.id,
				name: e.name
			};
		});
		tabsContext.tabs.set(res);
	}

	$: tabSet = tabsContext?.tabSet;

	$: if (factories.length > 0) {
		activeFactory = factories[0];
	}
	$: clearTabs = tabsContext?.clearTabs;

	onDestroy(() => {
		if ($clearTabs) $clearTabs();
	});
</script>

<div
	bind:this={container}
	class="h-full w-full"
	class:bg-surface-50-900-token={!$modeCurrent}
	class:bg-white={$modeCurrent}
>
	<EditorSharedOverlay />
	{#each examples as example, i (example)}
		<Editor
			bind:factory={factories[i]}
			loadExample={example}
			hidden={factories[i] === undefined || factories[i].id !== $tabSet}
		/>
	{/each}
</div>
