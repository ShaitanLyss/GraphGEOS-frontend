import { AreaPlugin } from "rete-area-plugin";
import { NodeEditor } from "../NodeEditor";
import { RenderSetup } from "../customization/render";
import { AreaExtra } from "../node/AreaExtra";
import { Schemes } from "../node/Schemes";
import { Setup } from "./Setup";
import { MinimapSetup } from "./MinimapSetup";
import { NodeFactory } from "../node/NodeFactory";

export class MegaSetup extends Setup {
    renderSetup = new RenderSetup();
    minimapSetup = new MinimapSetup();

    setup(editor: NodeEditor, area: AreaPlugin<Schemes, AreaExtra>, factory: NodeFactory) {
        this.renderSetup.setup(editor, area, factory)
        this.minimapSetup.setup(editor, area, factory);
    }

}