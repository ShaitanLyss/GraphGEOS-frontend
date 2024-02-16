import type { NodeEditor, Output, Socket } from '$rete';
import { get } from 'svelte/store';
import { Node } from '../Node';
import type { NodeFactory } from '../NodeFactory';

export class VariableNode extends Node {
	private editor: NodeEditor;
	public readonly variableId: string;

	constructor({ factory, variableId }: { factory: NodeFactory; variableId: string }) {
		super({ factory, params: { variableId }, height: 40, width: 150 });
		this.variableId = variableId;
		this.editor = factory.getEditor();
		const variable = get(this.editor.variables)[variableId];
		this.addOutData({ name: 'value', type: variable.type, socketLabel: variable.type });
		this.editor.variables.subscribe((variables) => {
			if (variableId in variables) {
				this.label = variables[variableId].name;
				(this.outputs['value'] as Output).socket.type = variables[variableId].type;
			} else this.label = 'Variable not found';
			this.updateElement();
			try {
				this.factory.dataflowEngine.reset(this.id);
			} catch (e) {}
		});
	}

	data(inputs?: Record<string, unknown> | undefined): Record<string, unknown> {
		return {
			value: get(this.editor.variables)[this.variableId].value
		};
	}
}
