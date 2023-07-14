import type { Node, OutDataParams } from '$rete/node/Node';
import { NodeComponent } from './NodeComponent';

export class PythonNodeComponent extends NodeComponent {
    private importsStatements: Set<string> = new Set();
    private code: string[] = [];
    private variables: Record<string, string> = {};

    constructor({owner} : {owner: Node}) {
        super({id:"python_NC", owner: owner});
    }

    addImportStatement(statement: string) {
        this.importsStatements.add(statement);
    }

    addCode(code: string) {
        this.code.push(code);
    }

    addOutData(params: OutDataParams) {
        const {name} = params;
        // TODO: avoid duplicates
        this.variables[name] = name;
        this.node.addOutData(params)
    }

    static collectPythonData(node: Node): {importsStatements: Set<string>, code: string[]} {
        console.log("outgoing", node.outgoingConnections);

        return {
            importsStatements: node.pythonComponent.importsStatements,
            code: node.pythonComponent.code,
        }
    }

    toPython(): string {
        // const PythonWorker = await import('$rete/components/Python_NC.worker?worker');
        // const worker = new PythonWorker.default();
        // worker.postMessage("Hello world from window!")
        // TODO: implement web worker
        const {importsStatements, code} = PythonNodeComponent.collectPythonData(this.node);
        const imports = [...this.importsStatements].join("\n");


        return(
    `
import argparse

from mpi4py import MPI

#GEOSX
${imports}
    
def parse_args():
    """Get arguments

    Returns:
        argument '--xml': Input xml file for GEOSX
        argument '--decision': Decision file
        argument '--database': Database file for coordinate conversion. Default is \"identity\" (i.e., no conversion)
        argument '--scalco': scalco (coordinate scaling). Default is 1
        argument '--scalel': scalel (elevation scaling). Default is 1
    """
    parser = argparse.ArgumentParser(description="Modeling acquisition example")
    parser.add_argument('--xml', type=str, required=True,
                        help="Input xml file for GEOSX")
    parser.add_argument('--segdir', type=str, required=True,
                        help="Directory containing the .segy files for the acquisition")           

    args ,_ = parser.parse_known_args()
    return args

def main():
    comm = MPI.COMM_WORLD
    rank = comm.Get_rank()
    
    args = parse_args()
    xmlfile = args.xml
    segdir = args.segdir

    xml = XML(xmlfile)


`
        );
    } 


}