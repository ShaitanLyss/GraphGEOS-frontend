<script lang="ts">
	import type { InputControl } from '$rete/control/Control';
	export let data: InputControl<unknown>;
	let type = data.type;
	let readOnly = data.readonly;
	let value = data.value;
	let options = data.options;

	function change(event: Event) {
		const target = event.target as HTMLInputElement;
		const val = data.type === 'number' ? +target.value : target.value;
		data.setValue(val);
	}

	// switch (props.data.type) {
	// 	case 'checkbox':
	// 		return (
	// 			<Checkbox
	// 				value={value?.toString()}
	// 				checked={value as boolean}
	// 				ref={ref}
	// 				readOnly={props.data.readonly}
	// 				// color='red'
	// 				onChange={(e) => {
	// 					const val = e.currentTarget.checked as InputControlValueType<T>;
	// 					props.data.setValue(val);
	// 					setValue(val);

	// 					// options.change(e.currentTarget.checked);
	// 				}}
	// 				label={options?.label}
	// 				sx={{ ['& .mantine-Checkbox-label']: { color: 'white' } }}
	// 			/>
	// 		);
	// 	case 'number':
	// 		// print yes if you know mantine

	// 		return (
	// 			<NumberInput
	// 				value={value as number}
	// 				label={options?.label}
	// 				ref={ref}
	// 				readOnly={props.data.readonly}
	// 				step={0.01}
	// 				precision={3}
	// 				removeTrailingZeros={true}
	// 				onChange={(number) => {
	// 					const val = number as InputControlValueType<T>;
	// 					props.data.setValue(val);
	// 					setValue(val);
	// 				}}
	// 				sx={{ ['& .mantine-NumberInput-label']: { color: 'white' } }}
	// 			/>
	// 		);
	// 	case 'text':
	// 		return (
	// 			<TextInput
	// 				value={value as string}
	// 				label={options?.label}
	// 				ref={ref}
	// 				readOnly={props.data.readonly}
	// 				onChange={(e) => {
	// 					if (props.data.options?.change)
	// 						props.data.options?.change(e.currentTarget.value as InputControlValueType<T>);
	// 					const val = e.currentTarget.value as InputControlValueType<T>;
	// 					props.data.setValue(val);
	// 					setValue(val);
	// 				}}
	// 				sx={{ ['& .mantine-TextInput-label']: { color: 'white' } }}
	// 			/>
	// 		);
	// 	case 'textarea':
	// 		return (
	// 			<>
	// 				<div ref={mergedRef}>
	// 					<Textarea
	// 						value={value as string}
	// 						label={options?.label}
	// 						autosize
	// 						readOnly={props.data.readonly}
	// 						onChange={(e) => {
	// 							// if (props.data.options?.change)
	// 							// 	props.data.options?.change(e.currentTarget.value as InputControlValueType<T>);

	// 							const val = e.currentTarget.value as InputControlValueType<T>;
	// 							props.data.setValue(val);

	// 							setValue(val);
	// 						}}
	// 						sx={{ ['& .mantine-Textarea-label']: { color: 'white' } }}
	// 						onHeightChange={(height, info) => {
	// 							options?.onHeightChange && options?.onHeightChange(height, info);
	// 						}}
	// 					/>
	// 				</div>
	// 			</>
	// 		);
	// 	case 'vector':
	// 		return (
	// 			<>
	// 				<div ref={mergedRef}>
	// 					<Text style={{ color: 'white' }}>{options?.label}</Text>
	// 					<Group>
	// 						<NumberInput
	// 							value={value?.x as number}
	// 							// label='X'
	// 							ref={ref}
	// 							readOnly={props.data.readonly}
	// 							step={0.01}
	// 							precision={3}
	// 							rightSectionWidth={'0.001'}
	// 							removeTrailingZeros={true}
	// 							style={{ width: '7ch' }}
	// 							hideControls={true}
	// 							// styles={{rightSection: {width: "1.65em"}}}
	// 							onChange={(number) => {
	// 								const val = { ...value, x: number } as InputControlValueType<T>;
	// 								props.data.setValue(val);
	// 								setValue(val);
	// 							}}
	// 							sx={{ ['& .mantine-NumberInput-label']: { color: 'white' } }}
	// 						/>
	// 						<NumberInput
	// 							value={value?.y as number}
	// 							// label='Y'
	// 							ref={ref}
	// 							readOnly={props.data.readonly}
	// 							step={0.01}
	// 							precision={3}
	// 							style={{ width: '7ch' }}
	// 							hideControls={true}
	// 							// styles={{rightSection: {width: "1.65em"}}}
	// 							removeTrailingZeros={true}
	// 							onChange={(number) => {
	// 								const val = { ...value, y: number } as InputControlValueType<T>;
	// 								props.data.setValue(val);
	// 								setValue(val);
	// 							}}
	// 							sx={{ ['& .mantine-NumberInput-label']: { color: 'white' } }}
	// 						/>
	// 						<NumberInput
	// 							value={value?.z as number}
	// 							// label='Z'
	// 							ref={ref}
	// 							readOnly={props.data.readonly}
	// 							step={0.01}
	// 							precision={3}
	// 							style={{ width: '7ch' }}
	// 							hideControls={true}
	// 							// styles={{rightSection: {width: "1.65em"}}}
	// 							removeTrailingZeros={true}
	// 							onChange={(number) => {
	// 								const val = { ...value, z: number } as InputControlValueType<T>;
	// 								props.data.setValue(val);
	// 								setValue(val);
	// 							}}
	// 							sx={{ ['& .mantine-NumberInput-label']: { color: 'white' } }}
	// 						/>
	// 					</Group>
	// 				</div>
	// 			</>
	// 		);
	// }
</script>

{#if type == 'checkbox'}
	<label class="label">
		<input
			on:pointerdown|stopPropagation={() => false}
			type="checkbox"
			class="checkbox"
			{value}
			checked={value}
			{readOnly}
			onChange={(e) => {
				const val = e.currentTarget.checked;
				data.setValue(val);
				// options.change(e.currentTarget.checked);
			}}
			label={options?.label}
		/>
		<span class="">{options?.label}</span>
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
