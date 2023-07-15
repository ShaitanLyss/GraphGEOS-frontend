import { dev } from '$app/environment';
import type { Node, OutDataParams } from '$rete/node/Node';
import { getVarsFromFormatString } from '$utils/string';
import { getMessageFormatter } from 'svelte-i18n';
import { NodeComponent } from './NodeComponent';

export class PythonNodeComponent extends NodeComponent {
	private importsStatements: Set<string> = new Set();
	private code: string[] = [];
	private variables: Record<string, string> = {};
	private codeTemplateGetter: () => string = this.getCodeTemplate;

	constructor({ owner }: { owner: Node }) {
		super({ id: 'python_NC', owner: owner });
	}

	addImportStatement(statement: string) {
		this.importsStatements.add(statement);
	}

	addCode(code: string) {
		this.code.push(code);
	}

	addOutData(params: OutDataParams) {
		const { name } = params;
		// TODO: avoid duplicates
		this.variables[name] = name;
		this.node.addOutData(params);
	}

	setCodeTemplateGetter(getter: () => string) {
		this.codeTemplateGetter = getter;
	}

	private getCodeTemplate() {
		return `
{this}
{exec}
`;
	}

	static collectPythonData(
		node: Node | null,
		indentation: string,
		parentVars: unknown,
		allVars: Set<string>
	): { importsStatements: Set<string>; code: string } {
		if (node === null) {
			return {
				importsStatements: new Set(),
				code: ''
			};
		}
		console.log('Node', node.label);
		console.log('exec', node.outgoingExecConnections);
		console.log('data', node.outgoingDataConnections);
		let codeTemplate = node.pythonComponent.codeTemplateGetter().trim();

		// add intentation in front of everyline of codeTemplate
		codeTemplate = codeTemplate.replaceAll(/^(?!.*{.*}.*)/gm, indentation);
		console.log('codeTemplate', codeTemplate);

		const templateVars: Record<string, string> = {};
		let resImportsStatements: Set<string> = node.pythonComponent.importsStatements;
		const pattern = /( *){(.+)}/gm;

		let match;
		while ((match = pattern.exec(codeTemplate)) !== null) {
			const childIndentation = match[1] + indentation;
			const key = match[2];
			if (key === 'this') {
				templateVars[key] = node.pythonComponent.code
					.map((code) => childIndentation + code)
					.join('\n');
			} else {
				const outgoer = node.getOutgoer(key.replace('_', '-'));
				const { importsStatements, code } = PythonNodeComponent.collectPythonData(
					outgoer,
					childIndentation,
					null,
					allVars
				);
				console.log('Before merge', resImportsStatements, importsStatements);
				// Merge imports statements
				resImportsStatements = new Set(
					(function* () {
						yield* resImportsStatements;
						yield* importsStatements;
					})()
				);
				console.log('After merge', resImportsStatements);

				templateVars[key] = code;
			}
		}
		const resCode = getMessageFormatter(codeTemplate).format(templateVars);
		if (resCode instanceof Array) {
			throw new Error('Code resulting from format must be a string, not an array');
		}
		return {
			importsStatements: resImportsStatements,
			code: resCode
		};
	}

	toPython(): string {
		// const PythonWorker = await import('$rete/components/Python_NC.worker?worker');
		// const worker = new PythonWorker.default();
		// worker.postMessage("Hello world from window!")
		// TODO: implement web worker
		const { importsStatements, code } = PythonNodeComponent.collectPythonData(
			this.node,
			'    ',
			null,
			new Set(['comm', 'rank', 'xml', 'args', 'xmlfile'])
		);
		const imports = [...importsStatements].join('\n');

		return `
import argparse

from mpi4py import MPI

#GEOSX
from utilities.input import XML
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

${code}
`.trim();
	}
}
