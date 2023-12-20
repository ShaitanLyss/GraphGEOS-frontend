import {
	type X2jOptionsOptional,
	XMLBuilder,
	XMLParser,
	type XmlBuilderOptionsOptional
} from 'fast-xml-parser';
import wu from 'wu';

const fxpSettings: X2jOptionsOptional & XmlBuilderOptionsOptional = {
	preserveOrder: true,
	attributeNamePrefix: '',
	ignoreAttributes: false,
	commentPropName: '#comment',
	parseAttributeValue: false,
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
	indent = 2,
	baseSpace = ''
}: {
	parsedXml: ParsedXmlNodes;
	indent?: number;
	baseSpace?: string;
}): string {
	console.log('parsedXml', parsedXml);
	const space = ' '.repeat(indent);
	const res: { xml: string; newLine?: boolean }[] = [];
	for (const element of parsedXml) {
		const attrs: string[] = [];
		let tag = '';
		let childXml = '';
		for (const [key, props] of Object.entries(element)) {
			switch (key) {
				case '#comment':
					console.log(props);
					res.push({ xml: `${baseSpace}<!--${props[0]['#text']}-->` });
					break;
				case ':@':
					for (const [attr, value] of Object.entries(props as ParsedXmlAttribute)) {
						attrs.push(`${baseSpace}${space}${attr}="${value}"`);
					}
					break;
				case '#text':
					break;
				default:
					tag = key;
					const children = props as ParsedXmlNode[];
					childXml = buildXml({
						parsedXml: children,
						indent,
						baseSpace: baseSpace + space
					});
					console.log('children', children);
					break;
			}
		}
		const preppedAttrs =
			attrs.length > 1 ? `\n${attrs.join('\n')}` : attrs.length === 1 ? ` ${attrs[0].trim()}` : '';
		if (tag)
			if (childXml.length === 0)
				res.push({
					xml:
						baseSpace +
						`<${tag}${preppedAttrs}${tag === '?xml' ? '?' : ' /'}>${tag === '?xml' ? '\n' : ''}`,
					newLine: attrs.length > 1
				});
			else
				res.push({
					xml: `${baseSpace}<${tag}${preppedAttrs}>\n${childXml}${
						childXml.at(-1) !== '\n' ? '\n' : ''
					}${baseSpace}</${tag}>`,
					newLine: true
				});
	}
	return wu(res)
		.map(({ xml, newLine }) => (newLine ? xml + '\n' : xml))
		.reduce((a, b) => a + (a ? '\n' : '') + b, '');
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
