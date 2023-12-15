<script lang="ts">
	import { Editor, EditorSharedOverlay } from '$lib/editor';
	import { setContext, notifications, getContext } from '$lib/global';
	import type { TabProps } from '$lib/layout';
	import type { NodeFactory } from '$rete';
	import type { EditorExample } from '$rete/example';
	import { newUniqueId } from '$utils';
	import { modeCurrent } from '@skeletonlabs/skeleton';
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';

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
	const rightSidebar = getContext('mainRightSideBar');

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

	onDestroy(() => {
		onDestroyCleanup();
	});
	$: clearTabs = tabsContext?.clearTabs;
	function onDestroyCleanup() {
		if ($clearTabs) $clearTabs();
		$rightSidebar = { component: undefined };
	}
</script>

<div
	bind:this={container}
	class="h-full w-full"
	class:bg-surface-50-900-token={!$modeCurrent}
	class:bg-white={$modeCurrent}
	in:fade
	out:fade={{ duration: 200 }}
	on:outrostart={onDestroyCleanup}
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
