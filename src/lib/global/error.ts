import { notifications } from '@mantine/notifications';
import { _ } from '$lib/global';
import { get } from 'svelte/store';
import { isLoading } from 'svelte-i18n';

let defaultErrorTitle = 'Error';
_.subscribe((locale) => {
	if (!get(isLoading)) defaultErrorTitle = locale('notifications.error.title');
});

export class ErrorWNotif extends Error {
	constructor({
		title,
		message: msg,
		emessage: emsg
	}: {
		title?: string;
		message?: string;
		emessage: string;
	}) {
		super(emsg);
		notifications.show({
			title: title ?? defaultErrorTitle,
			message: msg ?? emsg,
			color: 'red'
		});
	}
}
