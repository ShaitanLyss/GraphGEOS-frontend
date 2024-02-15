<script lang="ts">
	import { EditorButton, type ButtonExec } from '.';
	import { _ } from '$lib/global';
	import { faGem } from '@fortawesome/free-solid-svg-icons';
	import { AreaExtensions } from 'rete-area-plugin';

	const exec: ButtonExec = async ({ factory }) => {
		await factory.arrange.layout();
		const area = factory.getArea();
		if (!area) return;
		await AreaExtensions.zoomAt(area, factory.getEditor().getNodes());
	};
</script>

<EditorButton {exec} icon={faGem} tooltip={$_('editor.button.layout')} />
