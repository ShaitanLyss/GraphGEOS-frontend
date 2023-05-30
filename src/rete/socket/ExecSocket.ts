import { Socket } from './Socket';

export class ExecSocket extends Socket {
	constructor({ name }: { name?: string } = {}) {
		super({ name: name, type: 'exec' });
	}
}
