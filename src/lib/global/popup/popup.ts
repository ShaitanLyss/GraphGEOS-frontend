import type { Action } from 'svelte/action';
import { type PopupSettings, popup } from '@skeletonlabs/skeleton';
import type { ComponentType } from 'svelte';
import { writable, type Writable } from 'svelte/store';

export const globalPopupTarget = 'globalPopup';
export const globalTooltipTarget = 'globalTooltip';
export type GlobalPopupsContext = {
	globalPopupsProps: Record<string, Writable<GlobalPopupProps>>;
	globalTooltipsProps: Record<string, Writable<GlobalPopupProps>>;
	nextPopupKey: () => string | number;
	nextTooltipKey: () => string | number;
};

export type GlobalPopupProps = { content: ComponentType | string; arrow: boolean };
function makeGlobalPopupProps(params: { defaultContent: string }): Writable<GlobalPopupProps> {
	return writable({
		content: params.defaultContent,
		arrow: true
	});
}

export function makeGlobalPopupContext({
	numGlobalTooltips = 1,
	numGlobalPopups = 1
}: {
	numGlobalTooltips?: number;
	numGlobalPopups?: number;
}): GlobalPopupsContext {
	let tooltipUseCount: number;
	let globalPopupUseCount: number;
	return {
		nextPopupKey: () => globalPopupUseCount++ % numGlobalPopups,
		nextTooltipKey: () => tooltipUseCount++ % numGlobalTooltips,
		globalTooltipsProps: makeGlobalPopupsProps({ type: 'tooltip', num: numGlobalTooltips }),
		globalPopupsProps: makeGlobalPopupsProps({ type: 'popup', num: numGlobalPopups })
	};
}

export type GlobalPopupActionParams = Pick<
	PopupSettings,
	'closeQuery' | 'event' | 'middleware' | 'placement' | 'state'
> & { content: string | ComponentType; arrow?: boolean; globalPopupContext: GlobalPopupsContext };

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

function makeGlobalPopupAction({
	popupType
}: {
	popupType: PopupType;
}): Action<HTMLElement, GlobalPopupActionParams> {
	return (node, params) => {
		const globalPopupsContext = params.globalPopupContext;
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
			},
			destroy() {
				if (originalDestroy) originalDestroy();
			}
		};
	};
}

export const globalTooltip = makeGlobalPopupAction({ popupType: 'tooltip' });
export const globalPopup = makeGlobalPopupAction({ popupType: 'popup' });
