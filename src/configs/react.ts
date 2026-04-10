import type { OptionsFiles, OptionsOverrides, OptionsTypeScriptParserOptions, OptionsTypeScriptWithTypes, TypedFlatConfigItem } from '@/types'

import { isPackageExists } from 'local-pkg'

import { GLOB_ASTRO_TS, GLOB_MARKDOWN, GLOB_SRC, GLOB_TS, GLOB_TSX } from '@/globs'
import { interopDefault } from '@/utils'

// react refresh
const ReactRefreshAllowConstantExportPackages = [
	'vite',
]
const RemixPackages = [
	'@remix-run/node',
	'@remix-run/react',
	'@remix-run/serve',
	'@remix-run/dev',
]
const ReactRouterPackages = [
	'@react-router/node',
	'@react-router/react',
	'@react-router/serve',
	'@react-router/dev',
]
const NextJsPackages = [
	'next',
]

export async function react(
	options: OptionsFiles & OptionsOverrides & OptionsTypeScriptWithTypes & OptionsTypeScriptParserOptions = {},
): Promise<TypedFlatConfigItem[]> {
	const {
		files = [GLOB_SRC],
		filesTypeAware = [GLOB_TS, GLOB_TSX],
		ignoresTypeAware = [
			`${GLOB_MARKDOWN}/**`,
			GLOB_ASTRO_TS,
		],
		overrides = {},
		tsconfigPath,
	} = options

	const isTypeAware = !!tsconfigPath

	const typeAwareRules: TypedFlatConfigItem['rules'] = {
		'react/no-implicit-key': 'error',
		'react/no-leaked-conditional-rendering': 'warn',
	}

	const [
		pluginReact,
		pluginReactRefresh,
	] = await Promise.all([
		interopDefault(import('@eslint-react/eslint-plugin')),
		interopDefault(import('eslint-plugin-react-refresh')),
	] as const)

	const isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some(i => isPackageExists(i))
	const isUsingRemix = RemixPackages.some(i => isPackageExists(i))
	const isUsingReactRouter = ReactRouterPackages.some(i => isPackageExists(i))
	const isUsingNext = NextJsPackages.some(i => isPackageExists(i))
	const plugins = pluginReact.configs.all.plugins!

	return [
		{
			name: 'xat/react/setup',
			plugins: {
				'react': plugins['@eslint-react'],
				'react-refresh': pluginReactRefresh,
			},
		},
		{
			files,
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
				sourceType: 'module',
			},
			name: 'xat/react/rules',
			rules: {
				...pluginReact.configs.recommended.rules,

				// preconfigured rules from eslint-plugin-react-refresh https://github.com/ArnaudBarre/eslint-plugin-react-refresh/tree/main/src
				'react-refresh/only-export-components': [
					'error',
					{
						allowConstantExport: isAllowConstantExport,
						allowExportNames: [
							...(isUsingNext
								? [
										// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
										'dynamic',
										'dynamicParams',
										'revalidate',
										'fetchCache',
										'runtime',
										'preferredRegion',
										'maxDuration',
										// https://nextjs.org/docs/app/api-reference/functions/generate-static-params
										'generateStaticParams',
										// https://nextjs.org/docs/app/api-reference/functions/generate-metadata
										'metadata',
										'generateMetadata',
										// https://nextjs.org/docs/app/api-reference/functions/generate-viewport
										'viewport',
										'generateViewport',
										// https://nextjs.org/docs/app/api-reference/functions/generate-image-metadata
										'generateImageMetadata',
										// https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps
										'generateSitemaps',
									]
								: []),
							...(isUsingRemix || isUsingReactRouter
								? [
										'meta',
										'links',
										'headers',
										'loader',
										'action',
										'clientLoader',
										'clientAction',
										'handle',
										'shouldRevalidate',
									]
								: []),
						],
					},
				],

				// overrides
				...overrides,
			},
		},
		{
			files: filesTypeAware,
			name: 'xat/react/typescript',
			rules: {
				// Disables rules that are already handled by TypeScript
				'react/dom-no-string-style-prop': 'off',
				'react/dom-no-unknown-property': 'off',
			},
		},
		...isTypeAware
			? [{
					files: filesTypeAware,
					ignores: ignoresTypeAware,
					name: 'xat/react/type-aware-rules',
					rules: {
						...typeAwareRules,
					},
				}]
			: [],
	]
}
