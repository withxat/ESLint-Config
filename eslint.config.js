import styleMigrate from '@stylistic/eslint-plugin-migrate'

// eslint-disable-next-line antfu/no-import-dist
import { xat } from './dist/index.js'

export default xat(
	{
		formatters: true,
		pnpm: true,
		type: 'lib',
	},
	{
		ignores: [
			'_fixtures',
			'**/constants-generated.ts',
		],
	},
	{
		files: ['src/**/*.ts'],
		rules: {
			'perfectionist/sort-objects': 'error',
		},
	},
	{
		files: ['src/configs/*.ts'],
		plugins: {
			'style-migrate': styleMigrate,
		},
		rules: {
			'style-migrate/migrate': ['error', { namespaceTo: 'style' }],
		},
	},
)
