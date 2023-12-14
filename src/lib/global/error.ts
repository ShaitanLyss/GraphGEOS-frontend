import { notifications } from '@mantine/notifications';
import { _ } from '$lib/global';
import { get } from 'svelte/store';
import { browser } from '$app/environment';

export class ErrorWNotif extends Error {
	constructor(
		params:
			| {
					title?: string;
					message?: string;
					emessage: string;
			  }
			| string
	) {
		let title, msg, emsg;
		if (typeof params === 'string') emsg = params;
		else ({ title, message: msg, emessage: emsg } = params);

		super(emsg);
		if (browser)
			notifications.show({
				title: title ?? get(_)('notifications.error.title'),
				message: msg ?? emsg,
				color: 'red'
			});
	}
}
