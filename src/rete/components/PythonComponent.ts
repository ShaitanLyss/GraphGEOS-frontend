import { Node, type OutDataParams } from '$rete/node/Node';

export class PythonNodeComponent {
    private static importsStatements: Set<string> = new Set();
    private code: string[] = [];
    private variables: Record<string, string> = {};

    constructor(private node: Node) {
    }

    addImportStatement(statement: string) {
        PythonNodeComponent.importsStatements.add(statement);
    }

    addCode(code: string) {
        this.code.push(code);
    }

    addOutData(params: OutDataParams) {
        const {name} = params;
        this.variables[name] = name + Node.nodeCounts.toString;
        this.node.addOutData(params)
    }

    collectPythonData() {
        
    }

    toPython(): string {
        const imports = [...PythonNodeComponent.importsStatements].join("\n");

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