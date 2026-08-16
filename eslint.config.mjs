import { defineConfig } from '@trenaryja/config/eslint'

export default [
	...defineConfig(),
	{
		// Import order is handled by VS Code's organize-imports on save.
		rules: { 'perfectionist/sort-imports': 'off' },
	},
]
