import {
	type X2jOptionsOptional,
	XMLBuilder,
	XMLParser,
	type XmlBuilderOptionsOptional
} from 'fast-xml-parser';

const fxpSettings: X2jOptionsOptional & XmlBuilderOptionsOptional = {
	preserveOrder: true,
	attributeNamePrefix: '',
	ignoreAttributes: false,
	commentPropName: '#comment',
	parseAttributeValue: true,
	trimValues: true,
	format: true,
	ignoreDeclaration: false
};

function parseXml(xml: string): ParsedXmlNodes {
	const parser = new XMLParser({
		...fxpSettings
	});
	const parsed = parser.parse(xml) as ParsedXmlNodes;
	return parsed;
}

function buildXml({
	parsedXml,
	indent = 2
}: {
	parsedXml: ParsedXmlNodes;
	indent?: number;
}): string {
	const xmlBuilder = new XMLBuilder({
		...fxpSettings,
		indentBy: ' '.repeat(indent)
	});
	return xmlBuilder.build(parsedXml);
}

function formatXml({ xml, indent = 2 }: { xml: string; indent?: number }): string {
	const parsedXml = parseXml(xml);
	return buildXml({ parsedXml, indent });
}

function formatComment(comment: string): string {
	return `<!-- ${comment.trim()} -->`;
}

type ParsedXmlAttribute = Record<string, unknown>;

type ParsedXmlNode = {
	'#text'?: string;
	[key: string]: ParsedXmlAttribute | Array<ParsedXmlNode> | string | undefined;
};

type parsedXmlComment = {
	'#comment': string;
};

type ParsedXmlNodes = Array<
	| parsedXmlComment
	| {
			':@'?: ParsedXmlAttribute;
			[key: string]: ParsedXmlNodes | Array<ParsedXmlNode> | ParsedXmlAttribute | undefined;
	  }
>;

export type { ParsedXmlNodes, ParsedXmlNode, parsedXmlComment, ParsedXmlAttribute };
export { parseXml, formatXml, formatComment };
