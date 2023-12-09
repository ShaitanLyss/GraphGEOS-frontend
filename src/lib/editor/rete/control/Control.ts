import { ClassicPreset, getUID } from 'rete';

export class Control extends ClassicPreset.Control {}

export type InputControlTypes =
	| 'text'
	| 'number'
	| 'checkbox'
	| 'textarea'
	| 'vector'
	| 'unknown'
	| 'file';
export type InputControlValueType<T extends InputControlTypes> = T extends 'text'
	? string
	: T extends 'number'
	? number
	: T extends 'file'
	? string
	: T extends 'checkbox'
	? boolean
	: T extends 'textarea'
	? string
	: T extends unknown
	? unknown
	: T extends 'vector'
	? { x: number; y: number; z: number }
	: never;

export type InputControlOptions<N> = {
	readonly?: boolean;
	initial?: N;
	change?: (value: N) => void;
	debouncedOnChange?: (value: N) => void;
	onHeightChange?: (height: number, info: unknown) => void;
	label?: string;
	pattern?: string | null;
};

export class InputControl<
	T extends InputControlTypes = 'unknown',
	N = InputControlValueType<T>
> extends Control {
	value?: N;
	readonly: boolean;

	constructor(public type: T, public options?: InputControlOptions<N>) {
		super();

		this.id = getUID();
		this.readonly = options?.readonly ? options.readonly : false;

		let initial = options?.initial;

		if (initial === undefined) {
			switch (type) {
				case 'text':
					initial = '';
					break;
				case 'file':
					initial = './vtkfile.vtk';
					break;
				case 'number':
					initial = 0;
					break;
				case 'checkbox':
					initial = false;
					break;
				case 'textarea':
					initial = '';
					break;
				case 'vector':
					initial = { x: 0, y: 0, z: 0 };
					break;
			}
		}

		this.value = initial;
		// if (options && initial !== undefined && options.debouncedOnChange) {

		// 	options.debouncedOnChange(initial)
		// }
	}

	setValue(value?: N) {
		this.value = value;

		// if (this.options?.change && value) this.options.change(value);
	}
}
