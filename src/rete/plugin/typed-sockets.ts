import { BaseSchemes, NodeEditor, Root, Scope } from 'rete';
import type { Connection } from '../node/Node';
import type { Socket } from '../socket/Socket';
import { ExecSocket } from '../socket/ExecSocket';
import { structures } from 'rete-structures';

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

export function isConnectionInvalid(outputSocket: Socket, inputSocket: Socket) {
	return (
		outputSocket instanceof ExecSocket !== inputSocket instanceof ExecSocket ||
		(outputSocket.type !== inputSocket.type &&
			outputSocket.type !== 'any' &&
			inputSocket.type !== 'any')
	);
}

export class TypedSocketsPlugin<Schemes extends BaseSchemes> extends Scope<never, [Root<Schemes>]> {
	lastConnectionRemove: Connection | null = null;

	constructor() {
		super('typed-sockets');
	}

	setParent(scope: Scope<Root<Schemes>>): void {
		super.setParent(scope);

		// Prevent connections between incompatible sockets

		this.addPipe(async (ctx) => {
			console.log(ctx);
			let conn: Connection;

			// TODO : restore removed connection if it was removed for an impossible connection
			if (ctx.type === 'connectionremove' && (conn = ctx.data as Connection)) {
				console.log(ctx);

				this.lastConnectionRemove = conn;
			}

			if (ctx.type === 'connectioncreate' && (conn = ctx.data as Connection)) {
				const outputSocket = this.getOutputSocket(conn.source, conn.sourceOutput);
				const inputSocket = this.getInputSocket(conn.target, conn.targetInput);

				if (isConnectionInvalid(outputSocket, inputSocket)) {
					console.log(
						`Connection between ${conn.source} and ${conn.target} is not allowed. Output socket type is ${outputSocket.type} and input socket type is ${inputSocket.type}`
					);
					let nodeEditor: NodeEditor<Schemes>;

					if ((nodeEditor = scope as NodeEditor<Schemes>) && this.lastConnectionRemove) {
						console.log(`Restoring connection ${this.lastConnectionRemove?.id}`);

						await nodeEditor.addConnection(this.lastConnectionRemove);
					}

					return;
				}
				let nodeEditor: NodeEditor<Schemes>;
				if ((nodeEditor = scope as NodeEditor<Schemes>)) {
					if (outputSocket instanceof ExecSocket) {
						const connections = nodeEditor.getConnections();
						const outgoingConnections = connections
							.filter((connection) => connection.source === conn.source)
							.forEach((conn) => nodeEditor.removeConnection(conn.id));
					}
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
