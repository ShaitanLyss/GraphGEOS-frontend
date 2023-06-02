import { Node, NodeParams } from './Node';
import { notifications } from '@mantine/notifications';

export interface APINodeParams extends NodeParams {
	url: string;
}

export abstract class APINode extends Node {
	url: string;

	constructor(name: string, { url, height = 225, width = 150 }: APINodeParams) {
		super(name, { height: height, width: width });
		this.url = url;

		this.addInExec();
		this.addOutExec();
	}

	override async execute(input: string, forward: (output: string) => unknown): Promise<void> {
		// const inputs = (await this.fetchInputs()) as Record<string, unknown>;

		// notifications.show({ title: 'API Node', message: `Execution de l'appel API ${this.url}` });
		console.log(`API Node ${this.url} executed`);

		super.execute(input, forward);
	}
}

(APINode as unknown as { __isAbstract: boolean }).__isAbstract = true;
