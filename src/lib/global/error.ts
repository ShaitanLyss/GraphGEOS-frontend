import { notifications } from '@mantine/notifications';
import { _ } from '$lib/global';
import { get } from 'svelte/store';

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
			title: title ?? get(_)('notifications.error.title'),
			message: msg ?? emsg,
			color: 'red'
		});
	}
}
