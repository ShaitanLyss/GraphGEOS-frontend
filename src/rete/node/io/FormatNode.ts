import { getMessageFormatter, t } from 'svelte-i18n';
import { Node, type NodeParams } from '../Node';
import { capitalize, getVarsFromFormatString } from '../../../utils/string';

export interface FormatNodeParams extends NodeParams {
	format?: string;
	vars?: Record<string, unknown>;
}

export class FormatNode extends Node {
	formatInputHeight = 0;
	updateHeight = true;

	constructor({ factory, format = 'Hello {name}!', vars = { name: 'Lyss' } }: FormatNodeParams) {
		// super('Format', { factory, height: 124.181818 + 43.818182 });
		super({ label: 'Format', height: 124.181818 + 43.818182, factory, params: { format, vars } });
		this.formatInputHeight = 43.818182;
		this.addOutData({
			name: 'result',
			displayName: '',
			type: 'string'
		});
		this.addInData({
			name: 'format',
			displayName: 'Format',
			socketLabel: 'Format',
			type: 'string',
			control: {
				type: 'textarea',
				options: {
					label: 'Format',
					initial: format,
					debouncedOnChange: (value) => {
						this.updateDataInputs();

						this.params.format = value;
					},
					onHeightChange: (height, info) => {
						this.height -= this.formatInputHeight;
						this.formatInputHeight = height;
						this.height += height;
						if (this.updateHeight) {
							this.updateElement('node', this.id);

							this.updateHeight = false;
						} else {
							this.updateHeight = true;
						}
					}
				}
			}
		});

		this.updateDataInputs(vars);
	}

	override data(inputs?: Record<string, unknown[]> | undefined): { result?: string } {
		const res = { result: '' };
		if (inputs === undefined) return res;
		const values = {};
		Object.keys(this.inputs).forEach((key) => {
			if (key.startsWith('data-')) values[key.slice('data-'.length)] = this.getData(key, inputs);
		});
		try {
			res.result = getMessageFormatter(this.getData<'text'>('format', inputs) as string).format(
				values
			) as string;
		} catch (e) {
			//empty
		}
		return res;
	}

	updateDataInputs(inputs?: Record<string, unknown>) {
		const formatString = this.getData<'text'>('format', inputs);

		let anyChange = false;
		if (formatString) {
			try {
				const vars = getVarsFromFormatString(formatString);

				vars.forEach((varName) => {
					const key = 'data-' + varName;
					if (!(key in this.inputs)) {
						const varData = this.getData(varName, inputs);
						anyChange = true;
						this.addInData({
							name: key,
							displayName: capitalize(varName),
							socketLabel: capitalize(varName),
							control: {
								type: 'text',
								options: {
									label: capitalize(varName),
									initial: varData
								}
							}
						});
						this.height += 60;
					}
				});

				for (const key in this.inputs) {
					if (key.startsWith('data-') && !vars.includes(key.substr(5))) {
						this.removeInput(key);
						anyChange = true;
						this.height -= 60;
					}
				}
			} catch (error) {
				return;
			}
		}
		if (anyChange) this.updateElement('node', this.id);
	}
}
