import { InputControl, InputControlTypes, InputControlValueType } from './Control';
import * as React from 'react';
import { Drag } from 'rete-react-render-plugin';
import { addCustomization } from '../customization/render';
import { Checkbox, NumberInput, NumberInputHandlers } from '@mantine/core';

function InputControlComponent<T extends InputControlTypes>(props: { data: InputControl<T> }) {
	const options = props.data.options;
	const [value, setValue] = React.useState<InputControlValueType<T> | undefined>(props.data.value);
	const ref = React.useRef<HTMLInputElement>(null);

	Drag.useNoDrag(ref);

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
	}
}

addCustomization('control', (data: { payload: unknown }) => {
	if (data.payload instanceof InputControl) {
		return InputControlComponent;
	}
});
