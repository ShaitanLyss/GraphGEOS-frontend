module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
		'prettier',
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2020: true,
		node: true
	},
	"globals": {
		"NodeJS": true
	},

	rules: {
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'svelte/no-unused-svelte-ignore': 'off',
		'no-empty': 'off',
		'no-fallthrough': 'off',
		'no-useless-escape': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'no-case-declarations': 'off',
		'svelte/no-inner-declarations': 'off',
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	]
};
