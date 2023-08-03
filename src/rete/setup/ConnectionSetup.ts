import type { NodeEditor } from "$rete/NodeEditor";
import type { AreaExtra } from "$rete/node/AreaExtra";
import type { NodeFactory } from "$rete/node/NodeFactory";
import type { Schemes } from "$rete/node/Schemes";
import type { Area2D, AreaPlugin } from "rete-area-plugin";
import { Setup } from "./Setup";
import { ClassicFlow, ConnectionPlugin, EventType, Presets } from "rete-connection-plugin";
import { isConnectionInvalid } from "$rete/plugin/typed-sockets";
import type { Socket } from "$rete/socket/Socket";
import { notifications } from "@mantine/notifications";
import type { Root } from "rete";
import { findSocket } from "$rete/socket/utils";
import type { Node } from "$rete/node/Node";

let lastClickedSocket = false;

class MyConnectionPlugin extends ConnectionPlugin<Schemes, AreaExtra> {

     override async pick(event: PointerEvent, type: EventType): Promise<void> {
        if (event.button == 2) {
            if (type === "up") return;
            const pointedElements = document.elementsFromPoint(event.clientX, event.clientY)
            
            const pickedSocketData = findSocket(this.socketsCache, pointedElements)
            if (pickedSocketData === undefined)
                return;
                
            // pickedSocket.selected = !pickedSocket.selected;
            const node: Node = this.editor.getNode(pickedSocketData.nodeId)
            const socket = (pickedSocketData.side === 'input' ? node.inputs[pickedSocketData.key] : node.outputs[pickedSocketData.key])?.socket
            if (socket === undefined)
                throw new Error(`Socket not found for node ${node.id} and key ${pickedSocketData.key}`)
            
            lastClickedSocket = true;
            socket.selected = !socket?.selected
            node.updateElement()
            return;
        }
         super.pick(event, type);
     }
}

export class ConnectionSetup extends Setup {
    
    setup(editor: NodeEditor, area: AreaPlugin<Schemes, AreaExtra>, factory: NodeFactory): void {
        // let lastButtonClicked : number;
        // area.container.addEventListener('pointerdown', (e) => {
        //     e.preventDefault();
        //     e.stopPropagation();
        //     lastButtonClicked = e.button
        //     console.log("pointerdown", lastButtonClicked)
        //     return false;
        // }, false);
        const connection = new MyConnectionPlugin();
        Presets.classic.setup();
        connection.addPreset(
            () =>
                new ClassicFlow({
                    makeConnection(from, to, context) {
                        const forward = from.side === 'output' && to.side === 'input';
                        const backward = from.side === 'input' && to.side === 'output';
                        const [source, target] = forward ? [from, to] : backward ? [to, from] : [];

                        if (!source || !target) return false;
                        editor.addNewConnection(
                            editor.getNode(source.nodeId),
                            source.key,
                            editor.getNode(target.nodeId),
                            target.key
                        );
                        return true;
                    },
                    canMakeConnection(from, to) {
                        connection.drop();
                        // this function checks if the old connection should be removed
                        if (
                            isConnectionInvalid(
                                (from as unknown as { payload: Socket }).payload,
                                (to as unknown as { payload: Socket }).payload
                            )
                        ) {
                            console.log(
                                `Connection between ${from.nodeId} and ${to.nodeId} is not allowed. From socket type is ${from.payload.type} and to socket type is ${to.payload.type}`
                            );
                            notifications.show({
                                title: 'Erreur',
                                message: `Connection invalide entre types "${from.payload.type}" et "${to.payload.type}" !`,
                                color: 'red'
                            });
                            return false;
                        } else return true;
                    }
                })
        );

        connection.addPreset(Presets.classic.setup());
        connection.addPipe((ctx ) => {
            const ignored: (AreaExtra | Area2D<Schemes> | Root<Schemes>)["type"][] = [
                "unmount", "pointermove", "render", "rendered", "zoom", "zoomed",
                "translate", "translated"
            ];


            if (ctx.type === "contextmenu") {
                if (lastClickedSocket) {
                    lastClickedSocket = false;
                    ctx.data.event.preventDefault();
                    ctx.data.event.stopPropagation();
                    return;
                }

                return ctx;

            }

            // if (ctx.type === "contextmenu")
            // // if (ctx.type === 'connectionpick') {
            // //     console.log(ctx.data)
            // //     // return;
            // // }
            return ctx;
        });
        area.use(connection);
    }

}