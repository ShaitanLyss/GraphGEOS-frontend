import type { Action } from 'svelte/action';
import { PopupSettings, popup } from '@skeletonlabs/skeleton';
import type { ComponentType } from 'svelte';
import { writable, type Writable } from 'svelte/store';

export const globalPopupTarget = 'globalPopup';
export const globalTooltipTarget = 'globalTooltip';

function makeGlobalPopupProps(params: {
	defaultContent: string;
}): Writable<{ content: ComponentType | string; arrow: boolean }> {
	return writable({
		content: params.defaultContent,
		arrow: true
	});
}

export const globalTooltipProps = makeGlobalPopupProps({
	defaultContent: 'Missing global tooltip content'
});
export const globalPopupProps = makeGlobalPopupProps({
	defaultContent: 'Missing global popup content'
});

export type GlobalPopupSettings = Pick<
	PopupSettings,
	'closeQuery' | 'event' | 'middleware' | 'placement' | 'state'
> & { content: string | ComponentType; arrow?: boolean };

function makeGlobalPopupAction({
	target
}: {
	target: string;
}): Action<HTMLElement, GlobalPopupSettings> {
	return (node, params) => {
		const popupSettings: PopupSettings = { ...params, target: target };

		const events: (keyof HTMLElementEventMap)[] = [];

		switch (params.event) {
			case 'focus-blur':
			case 'focus-click':
				events.push('focus');
			case 'click':
				events.push('click');
				break;
			case 'hover':
				events.push('mouseenter');
				break;
			default:
				throw new Error('Invalid event type');
		}
		for (const event of events) {
			node.addEventListener(event, () => {
				globalPopupProps.set({
					content: params.content,
					arrow: params.arrow ?? true
				});
			});
		}
		// Set up the original action
		const { destroy: originalDestroy, update: originalUpdate } = popup(node, popupSettings);

		// Additional setup for the enhanced action

		return {
			update(newParams) {
				if (originalUpdate) originalUpdate({ ...newParams, target: target });
				throw new Error('Not implemented');
				// Optionally handle parameter updates
				// If the original action has an update method, you should call it here
			},
			destroy() {
				// Clean up the enhanced action
				// Call the original action's cleanup
				if (originalDestroy) originalDestroy();
			}
		};
	};
}

export const globalTooltip = makeGlobalPopupAction({ target: globalTooltipTarget });
export const globalPopup = makeGlobalPopupAction({ target: globalPopupTarget });
