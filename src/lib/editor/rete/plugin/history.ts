import type { BaseSchemes } from 'rete';
import { HistoryPlugin as BaseHistoryPlugin, type HistoryAction } from 'rete-history-plugin';
import { get, writable } from 'svelte/store';

export class HistoryPlugin<Schemes extends BaseSchemes> extends BaseHistoryPlugin<Schemes> {
	canRedo = writable(false);
	canUndo = writable(false);

	add(action: HistoryAction): void {
		super.add(action);
		this.canUndo.set(this.history.produced.length > 0);
		this.canRedo.set(this.history.reserved.length > 0);
		console.log('hey', get(this.canUndo));
	}

	async undo(): Promise<void> {
		await super.undo();
		console.log('undo', this.history.produced);
		this.canUndo.set(this.history.produced.length > 0);
		this.canRedo.set(this.history.reserved.length > 0);
	}

	async redo(): Promise<void> {
		await super.redo();
		this.canRedo.set(this.history.reserved.length > 0);
		this.canUndo.set(this.history.produced.length > 0);
	}
}
