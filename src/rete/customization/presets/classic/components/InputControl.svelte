<script lang="ts">
	import type { InputControl, InputControlTypes } from '$rete/control/Control';
	import { FileButton } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	export let data: InputControl<unknown>;
	let isReady = false;
	let type: InputControlTypes = data.type;
	let readonly = data.readonly;
	let value = data.value;
	let debouncedValue = value;
	let debouncedTimer: NodeJS.Timeout | undefined;
	let options = data.options;
	const pattern = options?.pattern;
	let isFirstSet = true;
	let fileList: FileList | undefined;

	// Debounce value
	$: if (!isFirstSet) {
		console.log('debounced', debouncedValue);
		data.setValue(debouncedValue);
		if (data?.options?.debouncedOnChange) data.options.debouncedOnChange(debouncedValue);
	}

	function onChange(val: unknown) {
		if (isFirstSet) {
		isFirstSet = false;
		// return;
		}
		
		value = val;

		if (data.options?.change !== undefined) data.options.change(val);
		clearTimeout(debouncedTimer);
		debouncedTimer = setTimeout(() => {
			debouncedValue = val;
		}, 200);
	}
	function onChangeFromEvent(event: Event) {
		const target = event.target as HTMLInputElement;
		const val = target.value;
		onChange(val);
	}

	function onFileChange(event: Event) {
		const val = (event.target as HTMLInputElement)?.value;
		console.log(val);
		console.log(typeof val);
		onChange(val);
	}
</script>

{#if type == 'checkbox'}
	<label class="label">
		<input
			on:pointerdown|stopPropagation={() => false}
			type="checkbox"
			class="checkbox"
			{value}
			checked={value}
			readOnly={readonly}
			on:change={(e) => onChange(e.currentTarget.checked)}
			label={options?.label}
		/>
		<!-- <span class="">{options?.label}</span> -->
		<span class="text-white">{options?.label}</span>
	</label>
{/if}
{#if type == 'number'}
	<label class="label">
		<span class="text-white"> {options?.label ? options?.label : ''}</span>
		<input
			type="number"
			class="hover:bg-surface-50-900-token focus:bg-surface-50-900-token w-full rounded-token bg-surface-200-700-token
				
			 text-surface-900-50-token border-token
			 focus:border-primary-500 focus:ring-primary-500 transition-colors"
			{value}
			{readonly}
			on:input={onChangeFromEvent}
			on:pointerdown|stopPropagation={() => false}
		/>
	</label>
{/if}
{#if type == 'text'}
	<label class="label">
		<!-- {options?.label ? options?.label : ''} -->
		<span class="text-white"> {options?.label ? options?.label : ''}</span>
		<input
			type="text"
			class="hover:bg-surface-50-900-token focus:bg-surface-50-900-token w-full rounded-token bg-surface-200-700-token
				
			 text-surface-900-50-token border-token
			 focus:border-primary-500 focus:ring-primary-500 transition-colors"
			{value}
			on:input={onChangeFromEvent}
			{readonly}
			on:pointerdown|stopPropagation={() => false}
		/>
	</label>
{/if}
{#if type == 'textarea'}
	<label class="label">
		<!-- {options?.label} -->
		<span class="text-white"> {options?.label ? options?.label : ''}</span>
		<textarea
			class="hover:bg-surface-50-900-token focus:bg-surface-50-900-token w-full rounded-md bg-surface-200-700-token
			 text-surface-900-50-token border-token
			 focus:border-primary-500 focus:ring-primary-500 transition-colors
			 "
			{value}
			{readonly}
			on:input={onChangeFromEvent}
			on:pointerdown|stopPropagation={() => false}
		/>
	</label>
{/if}
{#if type == 'vector'}
	<div class="label">
		<span class="text-white text-sm">{options?.label ? options?.label : ''}</span>
		<div class="flex">
			<input
				type="number"
				class="hover:bg-surface-50-900-token focus:bg-surface-50-900-token w-full bg-surface-200-700-token
				rounded-tl-token rounded-bl-token
			 text-surface-900-50-token border-token
			 focus:border-primary-500 focus:ring-primary-500 transition-colors"
				name="x"
				value={value.x}
				readOnly={readonly}
				on:input={(e) => {
					onChange({ ...value, x: Number(e.currentTarget.value) });
					// data.setValue(val);
				}}
				on:pointerdown|stopPropagation={() => false}
			/>
			<input
				name="y"
				type="number"
				class="hover:bg-surface-50-900-token focus:bg-surface-50-900-token w-full bg-surface-200-700-token
			 text-surface-900-50-token border-token
			 focus:border-primary-500 focus:ring-primary-500 transition-colors"
				value={value.y}
				{readonly}
				on:input={(e) => {
					onChange({ ...value, y: Number(e.currentTarget.value) });
					// data.setValue(val);
				}}
				on:pointerdown|stopPropagation={() => false}
			/>
			<input
				type="number"
				class="hover:bg-surface-50-900-token focus:bg-surface-50-900-token w-full bg-surface-200-700-token
				rounded-tr-token rounded-br-token
			 text-surface-900-50-token border-token
			 focus:border-primary-500 focus:ring-primary-500 transition-colors"
				name="z"
				value={value.z}
				{readonly}
				on:input={(e) => {
					const val = { ...value, z: Number(e.currentTarget.value) };
					onChange(val);
					// data.setValue(val);
				}}
				on:pointerdown|stopPropagation={() => false}
			/>
		</div>
	</div>
{/if}
{#if type === 'file'}
	<label class="label">
		<!-- {options?.label ? options?.label : ''} -->
		<span class="text-white"> {options?.label ? options?.label : ''}</span>
		<input
			type="text"
			class="hover:bg-surface-50-900-token focus:bg-surface-50-900-token w-full rounded-token bg-surface-200-700-token
				
			 text-surface-900-50-token border-token
			 focus:border-primary-500 focus:ring-primary-500 transition-colors"
			{value}
			on:input={onChangeFromEvent}
			{readonly}
			on:pointerdown|stopPropagation={() => false}
		/>
	</label>
{/if}
