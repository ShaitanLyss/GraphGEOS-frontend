import type { NodeEditor, NodeFactory } from '$rete';
import DownloadGraphButton from './DownloadGraphButton.svelte';
import EditorButton from './EditorButton.svelte';
import LoadGraphFromFileButton from './LoadGraphFromFileButton.svelte';
import SaveGraphButton from './SaveGraphButton.svelte';
import ToggleGeosButton from './ToggleGeosButton.svelte';
import ToPythonButton from './ToPythonButton.svelte';
import UploadGraphButton from './UploadGraphButton.svelte';

export {
	DownloadGraphButton,
	EditorButton,
	LoadGraphFromFileButton,
	SaveGraphButton,
	ToggleGeosButton,
	ToPythonButton,
	UploadGraphButton
};

export type ButtonExec = (params: {
	editor: NodeEditor;
	factory: NodeFactory;
	editorViewport: HTMLElement;
}) => unknown;
export type ButtonExecNoNeedFactory = () => unknown;
