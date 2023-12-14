import { assert, describe, it } from 'vitest';
import { formatXml, formatAttributes, parseXml, ParsedXmlNodes, formatComment } from '$utils/xml';

describe('parseXml', () => {
	it('parses basic xml', () => {
		const xml = `<root><child>test text</child></root>`;
		const parsed = parseXml(xml);
		const expected: ParsedXmlNodes = [
			{
				root: [
					{
						child: [
							{
								'#text': 'test text'
							}
						]
					}
				]
			}
		];
		assert.deepEqual(parsed, expected);
	});

	it('parses xml with attributes', () => {
		const xml = `<root a="1" b="2"><child>test text</child></root>`;
		const parsed = parseXml(xml);
		const expected: ParsedXmlNodes = [
			{
				root: [
					{
						child: [
							{
								'#text': 'test text'
							}
						]
					}
				],
				':@': {
					a: 1,
					b: 2
				}
			}
		];
		assert.deepEqual(parsed, expected);
	});

	it('parses xml with comments', () => {
		const xml = `<!-- comment --><root><child>test text</child></root>`;
		const parsed = parseXml(xml);
		const expected: ParsedXmlNodes = [
			{
				'#comment': [
					{
						'#text': ' comment '
					}
				]
			},
			{
				root: [
					{
						child: [
							{
								'#text': 'test text'
							}
						]
					}
				]
			}
		];
		assert.deepEqual(parsed, expected);
	});
});

// describe('formatAttributes', () => {
//     it('formats attributes', () => {
//         const attributes = {
//             a: '1',
//             b: '2'
//         };
//         const formatted = formatAttributes({ attributes });
//         const expected = `\n  a="1"\n  b="2"`;
//         assert.equal(formatted, expected);
//     });
//     it('formats attributes with indent', () => {
//         const attributes = {
//             a: '1',
//             b: '2'
//         };
//         const indent = 4;
//         const formatted = formatAttributes({ attributes, indent });
//         const expected = `\n    a="1"\n    b="2"`;
//         assert.equal(formatted, expected);
//     });
//     it('formats attributes with indent and newlines', () => {
//         const attributes = {
//             a: '1',
//             b: '2'
//         };
//         const indent = 4;
//         const formatted = formatAttributes({ attributes, indent });
//         const expected = `\n    a="1"\n    b="2"`;
//         assert.equal(formatted, expected);
//     });
// })

describe('formatComment', () => {
	it('formats comment', () => {
		const comment = 'test comment';
		const formatted = formatComment(comment);
		const expected = `<!-- test comment -->`;
		assert.equal(formatted, expected);
	});
	it('formats comment and trims spaces', () => {
		const comment = ' test comment   ';
		const formatted = formatComment(comment);
		const expected = `<!-- test comment -->`;
		assert.equal(formatted, expected);
	});
	it('formats comments and preserves inner new lines', () => {
		const comment = 'test\ncomment';
		const formatted = formatComment(comment);
		const expected = `<!-- test\ncomment -->`;
		assert.equal(formatted, expected);
	});
});

describe('formatXML', () => {
	it('formats XML', () => {
		const xml = `<root><child>text</child></root>`;
		const formatted = formatXml({ xml, indent: 2 });
		const expected = `\n<root>\n  <child>text</child>\n</root>`;
		assert.equal(formatted, expected);
	});
	//     it("preserves comments", () => {
	//         const xml = `<!-- comment --><root><child>text</child></root>`;
	//         const formatted = formatXml({ xml, indent: 2 });
	//         const expected = `<!-- comment -->\n<root>\n  <child>text</child>\n</root>`;
	//         assert.equal(formatted, expected);
	//     });

	//     it("sorts attributes alphabetically", () => {
	//         const xml = `<root b="2" a="1"><child>text</child></root>`;
	//         const formatted = formatXml({ xml, indent: 2 });
	//         const expected = `<root a="1" b="2">\n  <child>text</child>\n</root>`;
	//         assert.equal(formatted, expected);
	//     });

	//     it("puts each attribute on a new line", () => {
	//         const xml = `<root b="2" a="1"><child>text</child></root>`;
	//         const sizeIndent = 2;
	//         const _ = " ".repeat(sizeIndent)
	//         const formatted = formatXml({ xml, indent: sizeIndent });
	//         const expected = `
	// <root
	// ${_}a="1"
	// ${_}b="2"
	// >
	// ${_}<child>
	// ${_}${_}text
	// ${_}</child>
	// </root>`;
	//         assert.equal(formatted, expected);
});
