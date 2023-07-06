import { NodeEditor, GetSchemes, ClassicPreset } from "rete";
type Schemes = GetSchemes<
    ClassicPreset.Node,
    ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>;
import { AreaPlugin } from "rete-area-plugin";
import { SveltePlugin, Presets, SvelteArea2D } from "rete-svelte-plugin";
import CustomNode from "$custom-components/Node.svelte";


export async function createEditor(container: HTMLElement) {
    const editor = new NodeEditor<Schemes>();
    type AreaExtra = SvelteArea2D<Schemes>;
    const area = new AreaPlugin<Schemes, AreaExtra>(container);
    const render = new SveltePlugin<Schemes, AreaExtra>();
    render.addPreset(Presets.classic.setup({
        customize: {
            node(data) {
                return CustomNode;
            }
        }
    }));
    area.use(render);
    editor.use(area);

    const socket = new ClassicPreset.Socket("socket");
    const nodeA = new ClassicPreset.Node("A");
    nodeA.addControl("a", new ClassicPreset.InputControl("text", {}));
    nodeA.addOutput("a", new ClassicPreset.Output(socket));
    await editor.addNode(nodeA);
    const nodeB = new ClassicPreset.Node("B");
    nodeB.addControl("b", new ClassicPreset.InputControl("text", {}));
    nodeB.addInput("b", new ClassicPreset.Input(socket));
    await editor.addNode(nodeB);
    await editor.addConnection(new ClassicPreset.Connection(nodeA, "a", nodeB, "b"));

    
    
    await area.translate(nodeB.id, { x: 270, y: 0 });

}