<script>
	import '../app.postcss';
	import { Notifications } from '@mantine/notifications';
	import '../localization/i18n';

	// Your selected Skeleton theme:
	import '@skeletonlabs/skeleton/themes/theme-gold-nouveau.css';

	// This contains the bulk of Skeletons required styles:
	import '@skeletonlabs/skeleton/styles/skeleton.css';

	// Finally, your application's global stylesheet (sometimes labeled 'app.css')
	// import 'app.css'
	import '../app.postcss';

	import { AppShell } from '@skeletonlabs/skeleton';
</script>

<slot />

<react:Notifications position="top-right" />
