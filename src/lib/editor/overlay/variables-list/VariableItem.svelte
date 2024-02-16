<script lang="ts">
	import { assignControl, colorMap } from '$rete/customization/utils';
	import type { Variable } from '.';
	import cssVars from 'svelte-css-vars';
	import Color from 'color';
	import InputControlComponent from '$rete/customization/presets/classic/components/InputControl.svelte';
	import { InputControl, type InputControlTypes } from '$rete/control/Control';
	import type { SocketType } from '$rete/plugin/typed-sockets';
	import {
		popup,
		type PopupSettings,
		ListBox,
		ListBoxItem,
		getModalStore
	} from '@skeletonlabs/skeleton';
	import { newUniqueId, capitalize } from '$utils';
	import { createEventDispatcher } from 'svelte';
	import { spawnMoonMenu } from '$lib/menu/context-menu/moonContextMenu';
	import type { Point } from '$lib/types/Point';
	import { createActionMenuItem } from '$lib/menu';
	import { ErrorWNotif, _ } from '$lib/global';

	let v: Variable;
	export { v as variable };

	const modalStore = getModalStore();
	const dispatch = createEventDispatcher<{
		changetype: { type: SocketType };
		delete: { variable: Variable };
		change: { variable: Variable };
	}>();
	$: color = Color(colorMap[v.type])
		.saturationv(70)
		// .saturate(1.2)
		.string();

	// random color
	let discoInterval: NodeJS.Timeout;
	let disco = false;
	$: if (disco)
		discoInterval = setInterval(() => {
			color = `hsl(${Math.random() * 360}, 100%, 50%)`;
		}, 230);
	else clearInterval(discoInterval);
	let inputControl: InputControl<InputControlTypes> | undefined;

	let firstSet = true;
	$: if (!firstSet) dispatch('change', { variable: v });
	$: {
		const controlType = assignControl(v.type);
		if (!controlType) throw new Error(`Control type not found for ${v.type}`);
		if (inputControl?.type !== controlType) {
			if (!firstSet) {
				dispatch('changetype', { type: v.type });
			}
			console.log(controlType);
			inputControl = new InputControl(controlType, {
				initial: firstSet ? v.value : undefined,
				change: (val) => {
					console.log('change', v.id, val);
					v = { ...v, value: val };
				}
			});

			firstSet = false;
		}
	}

	const id = newUniqueId('variable-item');
	const possibleTypes: SocketType[] = ['string', 'number', 'boolean', 'vector', 'path'];
	let displayTypeSelection = false;
	const popupSettings: PopupSettings = {
		event: 'click',
		target: id,
		closeQuery: 'div',
		state: ({ state }) => (displayTypeSelection = state)
	};

	function openDeleteMenu({ pos }: { pos: Point }): void {
		spawnMoonMenu({
			pos,
			searchbar: false,
			items: [
				createActionMenuItem({
					label: 'Delete',
					description: 'Delete this variable',
					executeAction: () => {
						dispatch('delete', { variable: v });
					},
					tags: ['delete']
				})
			]
		});
	}

	function openRenamePrompt(): void {
		modalStore.trigger({
			type: 'prompt',
			title: $_('variable-item.rename-prompt.title'),
			value: v.name,
			buttonTextCancel: $_('button.cancel'),
			buttonTextSubmit: $_('button.rename'),
			valueAttr: { required: true, placeholder: $_('variable-item.rename-prompt.placeholder') },
			response(r) {
				if (r) {
					v.name = r;
				}
			}
		});
	}
</script>

<div class="bg-surface-50-900-token rounded-container-token p-2" data-popup={id}>
	{#if displayTypeSelection}
		<ListBox>
			{#each possibleTypes as type}
				<ListBoxItem bind:group={v.type} name="type" value={type}>
					<svelte:fragment slot="lead"
						><div
							class="rectangle-3d"
							use:cssVars={{ color: Color(colorMap[type]).saturationv(70).string() }}
						/></svelte:fragment
					>
					{capitalize(type)}
				</ListBoxItem>
			{/each}
		</ListBox>
	{/if}
</div>

<div class="flex items-center justify-between h-10">
	<div class="flex items-center gap-2 pe-2">
		<button type="button" class="btn px-0 pb-0 py-1" use:popup={popupSettings}>
			<div class="rectangle-3d" title={v.type} use:cssVars={{ color }} />
		</button>
		<button
			type="button"
			title={v.name}
			draggable="true"
			on:dragstart={(e) => {
				if (!e.dataTransfer) return;
				e.dataTransfer.setData('application/graph-variable', JSON.stringify(v));
			}}
			class="text-start text-ellipsis w-20 overflow-hidden pointer-events-auto hover:bg-surface-200-700-token rounded-token py-1 px-2"
			on:contextmenu|preventDefault|stopPropagation={(e) =>
				openDeleteMenu({ pos: { x: e.clientX, y: e.clientY } })}
			on:click={() => openRenamePrompt()}
		>
			{v.name}
		</button>
	</div>
	{#if inputControl}
		<InputControlComponent data={inputControl} width="w-56" />
	{/if}
</div>

<style lang="scss">
	.rectangle-3d {
		width: 1.2rem; /* Width of the rectangle */
		height: 0.6rem; /* Height of the rectangle */
		background-color: var(--color); /* Background color of the rectangle */
		border-radius: 15px; /* Rounded corners */
		box-shadow:
			-0px 1px 1px rgba(0, 0, 0, 0.4),
			/* Outer shadow for depth */ inset -1px 1px 2px rgba(255, 255, 255, 0.4); /* Inner shadow for effect*/
	}
</style>