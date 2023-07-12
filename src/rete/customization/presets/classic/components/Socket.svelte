<script lang="ts">
	import type { Socket } from '$rete/socket/Socket';
	export let data: Socket;
	import { assignColor } from '$rete/customization/utils';
	import cssVars from 'svelte-css-vars';

	let socketVars = { background: assignColor(data) };
	$: {
		socketVars = { background: assignColor(data) };
		// console.log("move to ", data.type)
	}
	setInterval(() => {
		socketVars = { background: assignColor(data) };
	}, 200);
</script>

<div class="socket {data.isArray ? 'array' : ''}" title={data.name} use:cssVars={socketVars} />

<style lang="scss" scoped>
	@use 'sass:math';
	@import '../vars';

	.socket {
		display: inline-block;
		cursor: pointer;
		border: 1px solid white;
		border-radius: math.div($socket-size, 2);
		width: $socket-size;
		height: $socket-size;
		margin: $socket-margin;
		vertical-align: middle;
		background: var(--background);
		z-index: 2;
		box-sizing: border-box;

		&:hover {
			border-width: 4px;
		}

		/* &.multiple {
			border-color: yellow;
		} */

		/* &.rete-output {
			margin-right: -1 * math.div($socket-size, 2);
		}

		&.rete-input {
			margin-left: -1 * math.div($socket-size, 2);
		} */
	}
	.array {
		border: 4px dashed var(--background);
		background: none;
		border-radius: 0%;
	}
</style>
