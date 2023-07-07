// import { ReactRenderPlugin } from 'rete-react-render-plugin';
import type { Schemes } from '../node/Schemes';
import type { AreaExtra } from '../node/AreaExtra';
// import { Presets } from 'rete-react-render-plugin';
import type { AreaPlugin } from 'rete-area-plugin';
// import { createRoot } from 'react-dom/client';
import type { NodeEditor } from 'rete';
// import { CustomArraySocket } from './presets/classic/components/CustomArraySocket';
import { ButtonControl } from '../control/button/button';
import type { NodeFactory } from '../node/NodeFactory';
import CustomButton from '../control/button/CustomButton.svelte';
import type { Setup } from '../setup/Setup';
import { SveltePlugin, Presets } from 'rete-svelte-plugin';

export class RenderSetup implements Setup {
	private render = new SveltePlugin<Schemes, AreaExtra>();

	setup(editor: NodeEditor<Schemes>, area: AreaPlugin<Schemes, AreaExtra>, factory: NodeFactory) {
		this.render.addPreset(
			Presets.classic.setup({
				customize: {
					// socket(context) {
					// 	if (context.payload instanceof Socket) {
					// 		if (context.payload.type === 'exec') return CustomExecSocket;
					// 		return context.payload.isArray ? CustomSocket : CustomSocket;
					// 	}

					// 	return Presets.classic.Socket;
					// },
					control(data) {
						// if (data.payload instanceof InputControl) {
						// 	return InputControlComponent;
						// }
						if (data.payload instanceof ButtonControl) {
							return CustomButton;
						}

						return Presets.classic.Control;
					}
					// connection(data) {
					// 	return CustomConnection;
					// },

					// node(data) {
					// 	return Node;
					// }
				}
			})
		);

		this.render.addPreset(Presets.contextMenu.setup({ delay: 50 }));
		this.render.addPreset(Presets.minimap.setup({ size: 200 }));

		area.use(this.render);
	}
}
