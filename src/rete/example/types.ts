import { NodeEditor } from '../NodeEditor';
import { Node } from '../node/Node';
import { NodeFactory } from '../node/NodeFactory';

export interface EditorExample {
	(factory: NodeFactory): Promise<Node[]>;
}
