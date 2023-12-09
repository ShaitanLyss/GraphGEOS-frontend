<script>
	import { browser } from '$app/environment';
	import { modeCurrent } from '@skeletonlabs/skeleton';
	import { setCookie } from './cookies';

	$: if (browser) {
		setCookie('current', String($modeCurrent), { forever: true });
	}
</script>
