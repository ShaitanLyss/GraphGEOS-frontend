import type { Action } from 'svelte/action';
import { PopupSettings, popup } from '@skeletonlabs/skeleton';
import { getAllContexts, type ComponentType } from 'svelte';
import { writable, type Writable } from 'svelte/store';
import { getContext } from '../context';

export const globalPopupTarget = 'globalPopup';
export const globalTooltipTarget = 'globalTooltip';
export type GlobalPopupsContext = {
	globalPopupsProps: Record<string, Writable<GlobalPopupProps>>;
	globalTooltipsProps: Record<string, Writable<GlobalPopupProps>>;
	nextPopupKey: () => string | number;
	nextTooltipKey: () => string | number;
};

export type GlobalPopupProps = { content?: ComponentType | string; arrow: boolean };
function makeGlobalPopupProps(params: { defaultContent: string }): Writable<GlobalPopupProps> {
	return writable({
		content: params.defaultContent,
		arrow: true
	});
}

export function makeGlobalPopupContext({
	numGlobalTooltips
}: {
	numGlobalTooltips: number;
}): GlobalPopupsContext {
	let tooltipUseCount: number;
	return {
		nextPopupKey: () => 0,
		nextTooltipKey: () => tooltipUseCount++ % numGlobalTooltips,
		globalTooltipsProps: makeGlobalPopupsProps({ type: 'tooltip', num: 3 }),
		globalPopupsProps: makeGlobalPopupsProps({ type: 'popup' })
	};
}

export type GlobalPopupActionParams = Pick<
	PopupSettings,
	'closeQuery' | 'event' | 'middleware' | 'placement' | 'state'
> & { content?: string | ComponentType; arrow?: boolean; type: keyof typeof GlobalPopupType };

export type PopupType = 'popup' | 'tooltip';
export enum GlobalPopupType {
	'popup' = 'globalPopup',
	'tooltip' = 'globalTooltip'
}

export function makeGlobalPopupsProps({
	type,
	num = 1
}: {
	type: keyof typeof GlobalPopupType;
	num?: number;
}): Record<string, Writable<GlobalPopupProps>> {
	const res: Record<string, Writable<GlobalPopupProps>> = {};
	for (let i = 0; i < num; i++) {
		res[`${GlobalPopupType[type]}${i}`] = makeGlobalPopupProps({
			defaultContent: `Missing ${type} content`
		});
	}
	return res;
}

export const globalPopup: Action<HTMLElement, GlobalPopupActionParams> = (node, params) => {
	console.log(getAllContexts());
	const popupType = params.type;
	const globalPopupsContext = getContext('globalPopups');
	let target: string;
	let globalPopupsProps: Record<string, Writable<GlobalPopupProps>>;
	if (popupType === 'popup') {
		target = globalPopupTarget + globalPopupsContext.nextPopupKey();
		globalPopupsProps = globalPopupsContext.globalPopupsProps;
	} else if (popupType === 'tooltip') {
		target = globalTooltipTarget + globalPopupsContext.nextTooltipKey();
		globalPopupsProps = globalPopupsContext.globalTooltipsProps;
	} else {
		throw new Error('Invalid popup type');
	}

	const globalPopupProps = globalPopupsProps[target];
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
			node.classList.add('[&>*]:pointer-events-none');
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
