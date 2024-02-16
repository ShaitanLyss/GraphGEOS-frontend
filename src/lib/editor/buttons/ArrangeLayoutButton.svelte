<script lang="ts">
	import { EditorButton, type ButtonExec } from '.';
	import { _, getContext, keyboardShortcut } from '$lib/global';
	import { faGem } from '@fortawesome/free-solid-svg-icons';
	import { AreaExtensions } from 'rete-area-plugin';

	const exec: ButtonExec = async ({ factory }) => {
		await factory.arrange.layout();
		const area = factory.getArea();
		if (!area) return;
		await AreaExtensions.zoomAt(area, factory.getEditor().getNodes());
	};
</script>

<EditorButton shortcut="a" {exec} icon={faGem} tooltip={$_('editor.button.layout')} />
