import type { NodeEditor } from "$rete/NodeEditor";
import type { AreaExtra } from "$rete/node/AreaExtra";
import type { NodeFactory } from "$rete/node/NodeFactory";
import type { Schemes } from "$rete/node/Schemes";
import type { Area2D, AreaPlugin } from "rete-area-plugin";
import { Setup } from "./Setup";
import type { Root } from "rete";

export class AreaSetup extends Setup {
    setup(editor: NodeEditor, area: AreaPlugin<Schemes, AreaExtra>, factory: NodeFactory): void {
        area.addPipe((ctx) => {
            const ignored : (AreaExtra | Area2D<Schemes> | Root<Schemes>)["type"][] = [
                "unmount", "pointermove", "render", "rendered", "zoom", "zoomed",
                "translate", "translated"
            ];
            if (ignored.includes(ctx.type)) {
                return ctx;
            }
            if (ctx.type === "pointerdown" && ctx.data.event instanceof MouseEvent
        && ctx.data.event.button === 2
    ) {
                const target = ctx.data.event.target as HTMLElement;
                if (!target.classList.contains("socket")) {
                    return ctx;
                }
                console.log("right click on socket")

                return;

            }
            return ctx;
        });
    }

}