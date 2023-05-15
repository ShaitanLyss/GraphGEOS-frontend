import type { GetSchemes } from 'rete';
import type { Connection, Node } from './MyTypes';
import type { DataflowEngineScheme } from 'rete-engine';

export type Schemes = GetSchemes<Node, Connection<Node, Node>> & DataflowEngineScheme;
