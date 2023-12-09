import { notifications } from '@mantine/notifications';
import { _ } from 'svelte-i18n';

let defaultErrorTitle = 'Error';
_.subscribe((locale) => {
	defaultErrorTitle = locale('notifications.error.title');
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
