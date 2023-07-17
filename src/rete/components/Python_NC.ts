import { dev } from '$app/environment';
import type { Node, OutDataParams } from '$rete/node/Node';
import { getVarsFromFormatString } from '$utils/string';
import { getMessageFormatter } from 'svelte-i18n';
import { NodeComponent } from './NodeComponent';
import { stat } from 'fs';

export type PythonComponentDataType = "static" | "dynamic";
export class PythonComponentData<
T extends PythonComponentDataType = "static" | "dynamic",
N = T extends "static" ? unknown : T extends "dynamic" ? string : unknown
>{
	type: T;
	data: N;

	constructor(type: T, data: N) {
		this.type = type;
		this.data = data;
	}
}

export class PythonNodeComponent extends NodeComponent {
	static isDynamicInput(inputs: Record<string, PythonComponentData[]>): boolean {
		return Object
		.entries(inputs)
		.some(([key, value]) => {
			return value.some((data) => data.type === "dynamic");
		});
	}
    async data(inputs: { [x: string]: PythonComponentData[]; }): Promise<Record<string, PythonComponentData>> {
		const isDynamicInput = PythonNodeComponent.isDynamicInput(inputs);
		// console.log(`${this.node.label}: inputs = `, inputs);
		const staticInputs: Record<string, unknown[]> = {};
		for (const [key, value] of Object.entries(inputs)) {
			staticInputs[key] = value.map((data) => data.data);
		}
		
		if (!isDynamicInput) {
			// convert inputs to regular inputs extracting data from PythonComponentData
			
			const staticData = this.node.data(staticInputs);
			if (staticData instanceof Promise) {
				throw new Error('Static data cannot be a promise');
			}
			const staticPyData: Record<string, PythonComponentData> = {};
			// convert static data to PythonComponentData
			for (const key in staticData) {
				if (this.dynamicOutputs.has(key)) {
					if (!(key in this.dataCodeGetters)) throw new Error(`Missing data code getter for ${key}`);
					staticPyData[key] = new PythonComponentData('dynamic', await this.formatPythonVars(this.dataCodeGetters[key]()))
					// console.log(`staticPyData[${key}] = ${staticPyData[key]}`)
				} else 
				staticPyData[key] = new PythonComponentData("static", staticData[key]);
			}

			return staticPyData;
		}
		

		const res: Record<string, PythonComponentData> = {};		
		// TODO: check missing data code getter
		for (const [key, dataGetter] of Object.entries(this.dataCodeGetters)) {
			if (!dataGetter) throw new Error(`Missing data code getter for ${key}`);
			const template = dataGetter();
			const varPattern = /([^$]*)\$(\(([^)]+)\)|\[([^]+)\])([^$]*)|([^]+)/g;
			let matchVar;
			let resCode = '';

			while ((matchVar = varPattern.exec(template)) !== null) {
				const codeBefore = matchVar[1];
				const varName = matchVar[3];
				const dataKey = matchVar[4];
				const codeAfter = matchVar[5];
				const codeWhenNoVar = matchVar[6];
				if (codeBefore) resCode += codeBefore;

				if (dataKey) {
					const data = this.node.getData(dataKey, staticInputs);
					if (data !== undefined) {
						resCode += PythonNodeComponent.toPythonData(data);
					}
				}

				if (varName) {
					// data is created by this node as a variable
					if (varName in this.actualCreatedVars) {
						resCode += this.actualCreatedVars[varName];
					} else {
						if (varName in this.node.ingoingDataConnections) {
						
							const pyData = inputs[varName][0];
							if (pyData.type === "static") {
								resCode += PythonNodeComponent.toPythonData(pyData.data);
							} else if (pyData.type === "dynamic") {
								resCode += pyData.data;
							}

						}
						// data comes from control
						else {
							const data = this.node.getData<"text">(varName, staticInputs);
							resCode += PythonNodeComponent.toPythonData(data);
						}
					}
				}
				if (codeAfter) resCode += codeAfter;
				if (codeWhenNoVar) resCode += codeWhenNoVar;
			}
			res[key] = new PythonComponentData("dynamic", resCode);
		}

		return res;
    }
	public dataCodeGetters: Record<string,(() => string)> = {};
	private importsStatements: Set<string> = new Set();
	private code: string[] = [];
	private createdVariables: Set<string> = new Set();
	private actualCreatedVars: Record<string, string> = {};
	private dynamicOutputs: Set<string> = new Set();



	private codeTemplateGetter: () => string = this.getCodeTemplate;
	private newlinesBefore: number = 0;

	constructor({ owner }: { owner: Node }) {
		super({ id: 'python_NC', owner: owner });
	}

	setDataCodeGetter(key: string, codeGetter: () => string) {
		this.dataCodeGetters[key] = codeGetter;
	}

	addImportStatement(...statements: string[]) {
		for (const statement of statements) {
			this.importsStatements.add(statement);
		}
	}

	addCode(...code: string[]) {
		this.code.push(...code);
	}

	addVariable(...names: string[]) {
		this.addDynamicOutput(...names.filter((key) => key in this.node.outputs));
		for (const name of names) {
			this.setDataCodeGetter(name, () => `$(${name})`);
			this.createdVariables.add(name);
		}
	}

	addVariables(...names: string[]) {
		this.addDynamicOutput(...names.filter((key) => key in this.node.outputs));
		for (const name of names) {
			this.setDataCodeGetter(name, () => `$(${name})`);
			this.createdVariables.add(name);
		}
	}

	addDynamicOutput(...name: string[]) {
		for (const n of name) {
			this.dynamicOutputs.add(n);
		}
	}

	setCodeTemplateGetter(getter: () => string) {
		this.codeTemplateGetter = getter;
	}

	setEmptyNewlinesBefore(numNewlines: number) {
		if (numNewlines < 0) throw new Error('Number of newlines must be positive');
		this.newlinesBefore = numNewlines;
	}

	private getCodeTemplate() {
		return `
{this}
{exec}
`;
	}

	private assignActualVars(usedVars: Set<string>): Set<string> {
		for (const varName of this.createdVariables) {
			let numAttempts = 0;
			let attemptedVarName = varName;
			while (usedVars.has(attemptedVarName)) {
				numAttempts++;
				attemptedVarName = varName + (numAttempts + 1);
			}
			this.actualCreatedVars[varName] = attemptedVarName;
			usedVars.add(attemptedVarName);
		}
		return usedVars;
	}

	static toPythonData(data: unknown): string {
		if (data === undefined) return 'None';
		if (data === null) return 'None';
		if (typeof data === 'string') return `"${data}"`;
		if (typeof data === 'number') return data.toString();
		if (typeof data === 'boolean') return data ? 'True' : 'False';
		if (typeof data === 'object') {
			if (Array.isArray(data)) {
				return `[${data.map((item) => PythonNodeComponent.toPythonData(item)).join(', ')}]`;
			} else {
				return `{${Object.entries(data)
					.map(([key, value]) => `${key}: ${PythonNodeComponent.toPythonData(value)}`)
					.join(', ')}}`;
			}
		}
		throw new Error(`Cannot convert data to python: ${data}`);
	}

	async fetch(): Promise<Record<string, PythonComponentData>> {
		return await this.node.getFactory().pythonDataflowEngine.fetch(this.node.id);
	}

	async fetchInputs(): Promise<Record<string, PythonComponentData[]>> {
		try {
		return await this.node.getFactory().pythonDataflowEngine.fetchInputs(this.node.id);
		} catch (e) {
			const firstMatch = /"(.*?)"/.exec(e.message as string);
			if (firstMatch) {
			const nodeId = firstMatch[1];
			console.error("Problematic node", this.node.getFactory().getEditor().getNode(nodeId))
			}
			throw e;
		}
	}

	// TODO : python dataflow engine

	private async formatPythonVars(template: string) {
		const varPattern = /([^$]*)\$(\(([^)]+)\)|\[([^]+)\])([^$]*)|([^]+)/g;
		let matchVar;
		let resCode = '';

		const inputs = await this.node.fetchInputs();

		while ((matchVar = varPattern.exec(template)) !== null) {
			const codeBefore = matchVar[1];
			const varName = matchVar[3];
			const dataKey = matchVar[4];
			const codeAfter = matchVar[5];
			const codeWhenNoVar = matchVar[6];
			if (codeBefore) resCode += codeBefore;

			if (dataKey) {
				const data = this.node.getData(dataKey, inputs);
				if (data !== undefined) {
					resCode += PythonNodeComponent.toPythonData(data);
				}
			}

			if (varName) {
				// data is created by this node as a variable
				if (varName in this.actualCreatedVars) {
					resCode += this.actualCreatedVars[varName];					
				} else {
					if (varName in this.node.ingoingDataConnections) {
						const inputs = await this.fetchInputs();
						const input = inputs[varName][0];
						
						if (input.type === "dynamic") {
							resCode += inputs[varName][0].data;
						} else {
							resCode += PythonNodeComponent.toPythonData(input.data);
						}

					} 
					// data comes from control
					else {
						const data = this.node.getData<"text">(varName, inputs);
						resCode += PythonNodeComponent.toPythonData(data);
					}
				}
			}
			if (codeAfter) resCode += codeAfter;
			if (codeWhenNoVar) resCode += codeWhenNoVar;
		}
		return resCode;
	}

	static async collectPythonData(
		node: Node | null,
		indentation: string,
		allVars: Set<string>
	): Promise<{ importsStatements: Set<string>; code: string; allVars: Set<string> }> {
		// Stop case
		if (node === null) {
			return {
				importsStatements: new Set(),
				code: '',
				allVars: allVars
			};
		}

		allVars = node.pythonComponent.assignActualVars(allVars);
		// console.log(node.pythonComponent.actualCreatedVars);

		// Get code template
		let codeTemplate = node.pythonComponent.codeTemplateGetter().trim();

		codeTemplate = await node.pythonComponent.formatPythonVars(codeTemplate);

		// Add intentation in front of everyline of codeTemplate
		codeTemplate = codeTemplate.replaceAll(/^(?!.*{.*}.*)/gm, indentation);
		if (node.label == "Initialize Solver") {
			console.log(codeTemplate);

		}

		const templateVars: Record<string, string> = {};
		let resImportsStatements: Set<string> = node.pythonComponent.importsStatements;

		// Pattern to match indendation and variables in code template
		const pattern = /( *){(.+)}/g;

		// Iterate on code template variables
		let match;
		while ((match = pattern.exec(codeTemplate)) !== null) {
			// Compute child indentation and ensure it is made of spaces
			const childIndentation = match[1].replaceAll('\t', '    ') + indentation;

			const key = match[2];
			if (key === 'this') {
				templateVars[key] = (
					await Promise.all(
						node.pythonComponent.code.map(
							async (code) => childIndentation + (await node.pythonComponent.formatPythonVars(code))
						)
					)
				).join('\n');
			} else {
				const outgoer = node.getOutgoer(key.replace('_', '-'));
				const childRes = await PythonNodeComponent.collectPythonData(
					outgoer,
					childIndentation,
					allVars
				);
				const { importsStatements, code } = childRes;
				allVars = childRes.allVars;
				// Merge imports statements
				resImportsStatements = new Set(
					(function* () {
						yield* resImportsStatements;
						yield* importsStatements;
					})()
				);

				templateVars[key] = code;
			}
		}
		codeTemplate = '\n'.repeat(node.pythonComponent.newlinesBefore) + codeTemplate;
		const resCodeTemplate = getMessageFormatter(codeTemplate).format(templateVars);
		if (resCodeTemplate instanceof Array) {
			throw new Error('Code resulting from format must be a string, not an array');
		}

		return {
			importsStatements: resImportsStatements,
			code: resCodeTemplate,
			allVars: allVars
		};
	}

	async toPython(): Promise<string> {
		// const PythonWorker = await import('$rete/components/Python_NC.worker?worker');
		// const worker = new PythonWorker.default();
		// worker.postMessage("Hello world from window!")
		// TODO: implement web worker
		const { importsStatements, code } = await PythonNodeComponent.collectPythonData(
			this.node,
			'    ',
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

    xml = XML(xmlfile)

${code}
`.trim();
	}
}
