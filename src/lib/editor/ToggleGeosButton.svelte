<script>
	import { faEarth } from '@fortawesome/free-solid-svg-icons';
	import EditorButton from './EditorButton.svelte';
	import { getContext } from 'svelte';
	const toggleGeos = getContext('toggleGeos');
</script>

<EditorButton
	icon={faEarth}
	on:click={() => (toggleGeos ? toggleGeos() : console.log('toggle geos'))}
/>
