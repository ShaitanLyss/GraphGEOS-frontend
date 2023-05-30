import { BaseSchemes, Root, Scope } from 'rete';
import type { Connection } from '../node/Node';
import type { Socket } from '../socket/Socket';
import { ExecSocket } from '../socket/ExecSocket';

export type SocketType =
	| string
	| 'exec'
	| 'any'
	| 'vector3'
	| 'number'
	| 'string'
	| 'boolean'
	| 'mesh'
	| 'geometry'
	| 'solver';

export class TypedSocketsPlugin<Schemes extends BaseSchemes> extends Scope<never, [Root<Schemes>]> {
	constructor() {
		super('typed-sockets');
	}

	setParent(scope: Scope<Root<Schemes>>): void {
		super.setParent(scope);

		// Prevent connections between incompatible sockets
		this.addPipe(async (ctx) => {
			// console.log('ctx', ctx);
			let conn: Connection;

			if (ctx.type === 'connectioncreate' && (conn = ctx.data as Connection)) {
				const outputSocket = this.getOutputSocket(conn.source, conn.sourceOutput);
				const inputSocket = this.getInputSocket(conn.target, conn.targetInput);

				if (
					outputSocket instanceof ExecSocket !== inputSocket instanceof ExecSocket ||
					(outputSocket.type !== inputSocket.type &&
						outputSocket.type !== 'any' &&
						inputSocket.type !== 'any')
				) {
					console.log(
						`Connection between ${conn.source} and ${conn.target} is not allowed. Output socket type is ${outputSocket.type} and input socket type is ${inputSocket.type}`
					);
					//ctx.cancel();
					return;
				}
			}

			return ctx;
		});
	}

	getInputSocket(nodeId: string, socketName: string | number): Socket {
		return this.parent.getNode(nodeId).inputs[socketName]?.socket;
	}

	getOutputSocket(nodeId: string, socketName: string | number): Socket {
		return this.parent.getNode(nodeId).outputs[socketName]?.socket;
	}
}
