<script lang="ts">
	import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import newUniqueId from 'locally-unique-id-generator';
	import type { NodeFactory } from '$rete';
	import { _ } from 'svelte-i18n';
	import { getContext } from '$lib/global/context';
	import type { ButtonExec, ButtonExecNoNeedFactory } from '.';
	import { ErrorWNotif } from '$lib/global/error';

	export let icon: IconDefinition;
	export let active = false;
	export let tooltip = 'Missing tooltip';
	export let exec: ButtonExec | undefined = undefined;
	export let execNoNeedActiveFactory: ButtonExecNoNeedFactory | undefined = undefined;

	const editorContext = getContext('editor');

	const target = 'buttonTooltip-' + newUniqueId();
	const popupHover: PopupSettings = {
		event: 'hover',
		target: target,
		placement: 'bottom'
	};

	function onExec() {
		if (!exec && !execNoNeedActiveFactory)
			throw new ErrorWNotif({
				emessage: 'Missing exec function',
				message: $_('editor.button.error.no_exec_function')
			});
		if (execNoNeedActiveFactory) execNoNeedActiveFactory();
		if (!exec) return;

		if (!editorContext) throw new ErrorWNotif({ emessage: 'Missing editor context' });

		const factory = editorContext.getActiveFactory();

		if (!factory)
			throw new ErrorWNotif({
				emessage: 'Missing active factory',
				message: $_('editor.button.error.no_active_factory')
			});
		const editorViewport = editorContext.getEditorViewport();
		if (!editorViewport)
			throw new ErrorWNotif({
				emessage: 'Missing editor viewport'
			});

		if (exec) exec({ editor: factory.getEditor(), factory, editorViewport });
	}
</script>

<div class="card p-4 variant-filled-secondary" data-popup={target}>
	<p>{tooltip}</p>
	<div class="arrow variant-filled-secondary" />
</div>
<button
	use:popup={popupHover}
	on:click={onExec}
	class="btn-icon [&>*]:pointer-events-none {active
		? 'variant-ghost-success'
		: 'variant-ghost-secondary'} pointer-events-auto"><Fa {icon} /></button
>
