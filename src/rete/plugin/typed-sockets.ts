import { BaseSchemes, Root, Scope } from 'rete';
import type { Connection } from '../node/MyTypes';

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
			console.log('ctx', ctx);
			let conn: Connection;

			// TODO : restore removed connection if it was removed for an impossible connection
			if (ctx.type === 'connectionremove' && (conn = ctx.data as Connection)) {
				
			}
			
			if (ctx.type === 'connectioncreate' && (conn = ctx.data as Connection)) {
				const outputSocketType = this.getOutputSocketType(conn.source, conn.sourceOutput);
				const inputSocketType = this.getInputSocketType(conn.target, conn.targetInput);

				if (
					outputSocketType == 'exec' && inputSocketType !== 'exec' ||
					outputSocketType !== inputSocketType &&
					outputSocketType !== 'any' &&
					inputSocketType !== 'any'
				) {
					console.log(
						`Connection between ${conn.source} and ${conn.target} is not allowed. Output socket type is ${outputSocketType} and input socket type is ${inputSocketType}`
					);
					//ctx.cancel();
					return;
				}
			}

			return ctx;
		});
	}

	getInputSocketType(nodeId: string, socketName: string | number) {
		return this.parent.getNode(nodeId).inputs[socketName]?.socket.type;
	}

	getOutputSocketType(nodeId: string, socketName: string | number) {
		return this.parent.getNode(nodeId).outputs[socketName]?.socket.type;
	}
}
