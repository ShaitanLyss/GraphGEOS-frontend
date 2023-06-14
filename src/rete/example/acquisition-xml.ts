import { Node } from '../node/Node';
import { NodeEditor } from '../NodeEditor';
import { ProblemNode } from '../node/xml/ProblemNode';
import { VtkOutputNode } from '../node/xml/VtkOutputNode';
import { MakeArrayNode } from '../node/data/MakeArrayNode';
import { FieldSpecificationNode } from '../node/xml/FieldSpecificationNode';
import { BoxXmlNode } from '../node/xml/geometry/BoxXmlNode';
import { GetNameNode } from '../node/xml/GetNameNode';

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
	await editor.addNewConnection(vtkOutput, 'value', outputMakeArray, 'data-0');
	await editor.addNewConnection(outputMakeArray, 'array', problem, 'outputs');

	const fieldSpecification1 = new FieldSpecificationNode({
		scale: 0.0,
		objectPath: 'nodeManager',
		fieldName: 'pressure_n',
		initialCondition: true
	});
	await editor.addNode(fieldSpecification1);
	const fieldSpecification2 = new FieldSpecificationNode({
		scale: 0.0,
		objectPath: 'nodeManager',
		fieldName: 'pressure_nm1',
		initialCondition: true
	});
	await editor.addNode(fieldSpecification2);
	const fieldSpecification3 = new FieldSpecificationNode({
		scale: 0.0,
		objectPath: 'faceManager',
		fieldName: 'FreeSurface'
	});
	await editor.addNode(fieldSpecification3);

	const fieldSpecificationsArray = new MakeArrayNode();
	fieldSpecificationsArray.addPin();
	fieldSpecificationsArray.addPin();

	await editor.addNode(fieldSpecificationsArray);
	await editor.addNewConnection(fieldSpecification1, 'value', fieldSpecificationsArray, 'data-0');
	await editor.addNewConnection(fieldSpecification2, 'value', fieldSpecificationsArray, 'data-1');
	await editor.addNewConnection(fieldSpecification3, 'value', fieldSpecificationsArray, 'data-2');
	await editor.addNewConnection(fieldSpecificationsArray, 'array', problem, 'fieldSpecifications');

	const fieldSpecification1SetNamesArray = new MakeArrayNode({
		'data-0': 'all'
	});
	await editor.addNode(fieldSpecification1SetNamesArray);
	await editor.addNewConnection(
		fieldSpecification1SetNamesArray,
		'array',
		fieldSpecification1,
		'setNames'
	);

	await editor.addNewConnection(fieldSpecificationsArray, 'array', problem, 'fieldSpecifications');

	const fieldSpecification2SetNamesArray = new MakeArrayNode({
		'data-0': 'all'
	});
	await editor.addNode(fieldSpecification2SetNamesArray);
	await editor.addNewConnection(
		fieldSpecification2SetNamesArray,
		'array',
		fieldSpecification2,
		'setNames'
	);

	const fieldSpecification3SetNamesArray = new MakeArrayNode();
	await editor.addNode(fieldSpecification3SetNamesArray);
	await editor.addNewConnection(
		fieldSpecification3SetNamesArray,
		'array',
		fieldSpecification3,
		'setNames'
	);

	// Geometry
	const geometryArray = new MakeArrayNode();
	await editor.addNode(geometryArray);
	const box = new BoxXmlNode({
		xMin: { x: -0.01, y: -0.01, z: 499.99 },
		xMax: { x: 500.01, y: 500.01, z: 500.01 }
	});
	await editor.addNode(box);
	await editor.addNewConnection(box, 'value', geometryArray, 'data-0');
	await editor.addNewConnection(geometryArray, 'array', problem, 'geometry');

	const getBoxName = new GetNameNode();
	await editor.addNode(getBoxName);
	await editor.addNewConnection(box, 'value', getBoxName, 'xml');

	await editor.addNewConnection(getBoxName, 'name', fieldSpecification3SetNamesArray, 'data-0');

	return editor.getNodes();
};