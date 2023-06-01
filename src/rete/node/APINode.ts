import { Node } from './Node';
import { notifications } from '@mantine/notifications';

export abstract class APINode extends Node {
	url: string;

	constructor(
		name: string,
		{ url, height = 225, width = 150 }: { url: string; height?: number; width?: number }
	) {
		super(name, { height: height, width: width });
		this.url = url;

		this.addInExec();
		this.addOutExec();
	}

	override async execute(input: string, forward: (output: string) => unknown): Promise<void> {
		notifications.show({ title: 'API Node', message: `Execution de l'appel API ${this.url}` });
		forward('exec');
	}
}

(APINode as unknown as { __isAbstract: boolean }).__isAbstract = true;
