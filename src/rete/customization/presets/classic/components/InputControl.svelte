<script lang="ts">
	import type { InputControl } from '$rete/control/Control';
	import { onMount } from 'svelte';
	export let data: InputControl<unknown>;
	let isReady = false;
	let type = data.type;
	let readonly = data.readonly;
	let value = data.value;
	let debouncedValue = value;
	let debouncedTimer: NodeJS.Timeout | undefined;
	let options = data.options;
	let isFirstSet = true;

	onMount(() => {
	});

	// Debounce value
	$:if (!isFirstSet) {
		data.setValue(debouncedValue)
		if (data?.options?.debouncedOnChange)
			data.options.debouncedOnChange(debouncedValue);
	}

	function change(event: Event) {
		if (isFirstSet) {
			isFirstSet = false;
			return;
		}
		
		const target = event.target as HTMLInputElement;
		const val = data.type === 'number' ? +target.value : target.value;
		clearTimeout(debouncedTimer);
		debouncedTimer = setTimeout(() => {
			debouncedValue = val;
		}, 200); 
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
			on:change={(e) => {
				const val = e.currentTarget.checked;
				console.log(val);
				
				data.setValue(val);
				// options.change(e.currentTarget.checked);
			}}
			label={options?.label}
		/>
		<span class="">{options?.label}</span>
	</label>
{/if}
{#if type == "number"}
	<label class="label">
		{options?.label ? options?.label : ""}
		<input
			type="number"
			class="input"
			{value}
			{readonly}
			on:input={change}
			on:pointerdown|stopPropagation={() => false}
		/>
	</label>
{/if}
{#if type == "text"}
	<label class="label">
		{options?.label ? options?.label : ""}
		<input
			type="text"
			class="input"
			{value}
			on:input={change}
			readonly={readonly}
			on:pointerdown|stopPropagation={() => false}
		/>
	</label>
{/if}
{#if type == "textarea"}
	<label class="label">
		{options?.label}
		<textarea
			class="input"
			{value}
			readonly={readonly}
			on:input={change}
			on:pointerdown|stopPropagation={() => false}
		/>
	</label>
{/if}
{#if type == "vector"}
	<label class="label">
		{options?.label}
		<div class="flex">
		<input
			type="number"
			class="input"
			value={value.x}
			readOnly={readonly}
			on:input={(e) => {
				const val = { ...value, x: e.currentTarget.value };
				data.setValue(val);
			}}
			on:pointerdown|stopPropagation={() => false}
		/>
		<input
			type="number"
			class="input"
			value={value.y}
			
			{readonly}
			on:input={(e) => {
				const val = { ...value, y: e.currentTarget.value };
				data.setValue(val);
			}}
			on:pointerdown|stopPropagation={() => false}
		/>
		<input
			type="number"
			class="input"
			value={value.z}
			{readonly}
			on:input={(e) => {
				const val = { ...value, z: e.currentTarget.value };
				data.setValue(val);
			}}
			on:pointerdown|stopPropagation={() => false}
		/>
		</div>
	</label>
{/if}

<!-- <input
	type={data.type}
	value={data.value}
	readonly={data.readonly}
	on:input={change}
	on:pointerdown|stopPropagation={() => false}
/> -->

<style>
	/* input {
		width: 100%;
		border-radius: 30px;
		background-color: white;
		padding: 2px 6px;
		border: 1px solid #999;
		font-size: 110%;
		box-sizing: border-box;
	} */
</style>
