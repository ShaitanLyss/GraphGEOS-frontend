import { InputControl, InputControlTypes, InputControlValueType } from './Control';
import * as React from 'react';
import { Drag } from 'rete-react-render-plugin';
import { addCustomization } from '../customization/render';
import {
	Checkbox,
	NumberInput,
	NumberInputHandlers,
	TextInput,
	Textarea,
	Text
} from '@mantine/core';
import { useDebouncedState, useDebouncedValue, useFocusTrap, useMergedRef } from '@mantine/hooks';

function InputControlComponent<T extends InputControlTypes>(props: { data: InputControl<T> }) {
	const options = props.data.options;
	const [value, setValue] = React.useState<InputControlValueType<T> | undefined>(props.data.value);
	const ref = React.useRef<HTMLInputElement>(null);
	const divRef = React.useRef<HTMLDivElement>(null);
	const [debouncedValue] = useDebouncedValue(value, 200, { leading: true });
	// const [debouncedValue, debouncedSetValue] = useDebouncedState('', 200, {leading: true});
	const [firstDebounce, setFirstDebounce] = React.useState(true);
	React.useEffect(() => {
		if (firstDebounce) {
			setFirstDebounce(false);
			return;
		}

		if (props.data.options?.debouncedOnChange)
			props.data.options?.debouncedOnChange(debouncedValue as InputControlValueType<T>);
	}, [debouncedValue, firstDebounce, props.data.options]);

	const mergedRef = useMergedRef(divRef);

	Drag.useNoDrag(ref);
	Drag.useNoDrag(divRef);

	// React.useEffect(() => {
	// 	setValue(props.data.value);
	// }, [props.data.value]);

	switch (props.data.type) {
		case 'checkbox':
			return (
				<Checkbox
					value={value?.toString()}
					checked={value as boolean}
					ref={ref}
					readOnly={props.data.readonly}
					// color='red'
					onChange={(e) => {
						const val = e.currentTarget.checked as InputControlValueType<T>;
						props.data.setValue(val);
						setValue(val);

						// options.change(e.currentTarget.checked);
					}}
					label={options?.label}
					sx={{ ['& .mantine-Checkbox-label']: { color: 'white' } }}
				/>
			);
		case 'number':
			// print yes if you know mantine

			return (
				<NumberInput
					value={value as number}
					label={options?.label}
					ref={ref}
					readOnly={props.data.readonly}
					step={0.01}
					precision={3}
					removeTrailingZeros={true}
					onChange={(number) => {
						const val = number as InputControlValueType<T>;
						props.data.setValue(val);
						setValue(val);
					}}
					sx={{ ['& .mantine-NumberInput-label']: { color: 'white' } }}
				/>
			);
		case 'text':
			return (
				<TextInput
					value={value as string}
					label={options?.label}
					ref={ref}
					readOnly={props.data.readonly}
					onChange={(e) => {
						if (props.data.options?.change)
							props.data.options?.change(e.currentTarget.value as InputControlValueType<T>);
						const val = e.currentTarget.value as InputControlValueType<T>;
						props.data.setValue(val);
						setValue(val);
					}}
					sx={{ ['& .mantine-TextInput-label']: { color: 'white' } }}
				/>
			);
		case 'textarea':
			return (
				<>
					<div ref={mergedRef}>
						<Textarea
							value={value as string}
							label={options?.label}
							autosize
							readOnly={props.data.readonly}
							onChange={(e) => {
								// if (props.data.options?.change)
								// 	props.data.options?.change(e.currentTarget.value as InputControlValueType<T>);

								const val = e.currentTarget.value as InputControlValueType<T>;
								props.data.setValue(val);

								setValue(val);
							}}
							sx={{ ['& .mantine-Textarea-label']: { color: 'white' } }}
							onHeightChange={(height, info) => {
								options?.onHeightChange && options?.onHeightChange(height, info);
							}}
						/>
					</div>
				</>
			);
	}
}

addCustomization('control', (data: { payload: unknown }) => {
	if (data.payload instanceof InputControl) {
		return InputControlComponent;
	}
});
