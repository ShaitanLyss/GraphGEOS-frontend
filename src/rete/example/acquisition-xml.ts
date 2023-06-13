import { Node } from "../node/Node";
import { NodeEditor } from "../NodeEditor";
import { ProblemNode } from "../node/xml/ProblemNode";
import { VtkOutputNode } from "../node/xml/VtkOutputNode";
import {MakeArrayNode} from "../node/data/MakeArrayNode"

interface XmlExample {
    (editor: NodeEditor): Promise<Node[]>;
}


export const acquisitionXmlExample: XmlExample = async (editor: NodeEditor) => {
    const problem = new ProblemNode();
    await editor.addNode(problem);
    
    const outputMakeArray = new MakeArrayNode();
    await editor.addNode(outputMakeArray);

    const vtkOutput = new VtkOutputNode();
    await editor.addNode(vtkOutput);
    await editor.addNewConnection(vtkOutput, 'value', outputMakeArray, "data-0");

    return editor.getNodes();
}

