import { ClassicPreset, getUID } from 'rete';

export class Control extends ClassicPreset.Control {}

export type InputControlTypes = 'text' | 'number' | 'checkbox';
export type InputControlValueType<T extends InputControlTypes> = T extends 'text'
	? string
	: T extends 'number'
	? number
	: T extends 'checkbox'
	? boolean
	: never;

export type InputControlOptions<N> = {
	readonly?: boolean;
	initial?: N;
	change?: (value: N) => void;
	label?: string;
};

export class InputControl<
	T extends InputControlTypes,
	N = InputControlValueType<T>
> extends Control {
	value?: N;
	readonly: boolean;

	constructor(public type: T, public options?: InputControlOptions<N>) {
		super();

		this.id = getUID();
		this.readonly = options?.readonly ? options.readonly : false;

		if (typeof options?.initial !== 'undefined') this.value = options.initial;
	}

	setValue(value?: N) {
		this.value = value;

		if (this.options?.change && value) this.options.change(value);
	}
}
