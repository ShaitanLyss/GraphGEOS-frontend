import * as React from 'react';
import { Button } from '@mantine/core';
import { ClassicPreset } from 'rete';
import { addCustomization } from '../../customization/render';

export class ButtonControl extends ClassicPreset.Control {
	constructor(public label: string, public onClick: () => void) {
		super();
	}
}

function CustomButton(props: { data: ButtonControl }) {
	return (
		<Button
			onPointerDown={(e) => e.stopPropagation()}
			onDoubleClick={(e) => e.stopPropagation()}
			onClick={props.data.onClick}
			styles={{root: {backgroundColor: "#228be6 !important"}}}
		>
			{props.data.label}

		</Button>
	);
}

addCustomization('control', (data: { payload: unknown }) => {
	if (data.payload instanceof ButtonControl) {
		return CustomButton;
	}
});
