import type { OptionsFormatters, StylisticConfig, TypedFlatConfigItem } from '@/types'
import type { VendoredPrettierOptions, VendoredPrettierRuleOptions } from '@/vender/prettier-types'
import { StylisticConfigDefaults } from '@/configs/stylistic'
import { GLOB_ASTRO, GLOB_ASTRO_TS, GLOB_CSS, GLOB_GRAPHQL, GLOB_HTML, GLOB_LESS, GLOB_MARKDOWN, GLOB_POSTCSS, GLOB_SCSS, GLOB_SVG, GLOB_XML } from '@/globs'
import { interopDefault, parserPlain } from '@/utils'
import { isPackageExists } from 'local-pkg'

function mergePrettierOptions(
	options: VendoredPrettierOptions,
	overrides: VendoredPrettierRuleOptions = {},
): VendoredPrettierRuleOptions {
	return {
		...options,
		...overrides,
		plugins: [
			...(overrides.plugins || []),
			...(options.plugins || []),
		],
	}
}

export async function formatters(
	options: OptionsFormatters | true = {},
	stylistic: StylisticConfig = {},
): Promise<TypedFlatConfigItem[]> {
	if (options === true) {
		options = {
			astro: isPackageExists('astro'),
			css: true,
			graphql: true,
			html: true,
			markdown: true,
			slidev: isPackageExists('@slidev/cli'),
			svg: true,
			xml: true,
		}
	}

	if (options.slidev && options.markdown !== true && options.markdown !== 'prettier')
		throw new Error('`slidev` option only works when `markdown` is enabled with `prettier`')

	const {
		indent,
		quotes,
		semi,
	} = {
		...StylisticConfigDefaults,
		...stylistic,
	}

	const prettierOptions: VendoredPrettierOptions = Object.assign(
		{
			endOfLine: 'auto',
			printWidth: 120,
			semi,
			singleQuote: quotes === 'single',
			tabWidth: typeof indent === 'number' ? indent : 2,
			trailingComma: 'all',
			useTabs: indent === 'tab',
		} satisfies VendoredPrettierOptions,
		options.prettierOptions || {},
	)

	const prettierXmlOptions: VendoredPrettierOptions = {
		xmlQuoteAttributes: 'double',
		xmlSelfClosingSpace: true,
		xmlSortAttributesByKey: false,
		xmlWhitespaceSensitivity: 'ignore',
	}

	const dprintOptions = Object.assign(
		{
			indentWidth: typeof indent === 'number' ? indent : 2,
			quoteStyle: quotes === 'single' ? 'preferSingle' : 'preferDouble',
			useTabs: indent === 'tab',
		},
		options.dprintOptions || {},
	)

	const pluginFormat = await interopDefault(import('eslint-plugin-format'))

	const configs: TypedFlatConfigItem[] = [
		{
			name: 'xat/formatter/setup',
			plugins: {
				format: pluginFormat,
			},
		},
	]

	if (options.css) {
		configs.push(
			{
				files: [GLOB_CSS, GLOB_POSTCSS],
				languageOptions: {
					parser: parserPlain,
				},
				name: 'xat/formatter/css',
				rules: {
					'format/prettier': [
						'error',
						mergePrettierOptions(prettierOptions, {
							parser: 'css',
						}),
					],
				},
			},
			{
				files: [GLOB_SCSS],
				languageOptions: {
					parser: parserPlain,
				},
				name: 'xat/formatter/scss',
				rules: {
					'format/prettier': [
						'error',
						mergePrettierOptions(prettierOptions, {
							parser: 'scss',
						}),
					],
				},
			},
			{
				files: [GLOB_LESS],
				languageOptions: {
					parser: parserPlain,
				},
				name: 'xat/formatter/less',
				rules: {
					'format/prettier': [
						'error',
						mergePrettierOptions(prettierOptions, {
							parser: 'less',
						}),
					],
				},
			},
		)
	}

	if (options.html) {
		configs.push({
			files: [GLOB_HTML],
			languageOptions: {
				parser: parserPlain,
			},
			name: 'xat/formatter/html',
			rules: {
				'format/prettier': [
					'error',
					mergePrettierOptions(prettierOptions, {
						parser: 'html',
					}),
				],
			},
		})
	}

	if (options.xml) {
		configs.push({
			files: [GLOB_XML],
			languageOptions: {
				parser: parserPlain,
			},
			name: 'xat/formatter/xml',
			rules: {
				'format/prettier': [
					'error',
					mergePrettierOptions({ ...prettierXmlOptions, ...prettierOptions }, {
						parser: 'xml',
						plugins: [
							'@prettier/plugin-xml',
						],
					}),
				],
			},
		})
	}
	if (options.svg) {
		configs.push({
			files: [GLOB_SVG],
			languageOptions: {
				parser: parserPlain,
			},
			name: 'xat/formatter/svg',
			rules: {
				'format/prettier': [
					'error',
					mergePrettierOptions({ ...prettierXmlOptions, ...prettierOptions }, {
						parser: 'xml',
						plugins: [
							'@prettier/plugin-xml',
						],
					}),
				],
			},
		})
	}

	if (options.markdown) {
		const formater = options.markdown === true
			? 'prettier'
			: options.markdown

		const GLOB_SLIDEV = !options.slidev
			? []
			: options.slidev === true
				? ['**/slides.md']
				: options.slidev.files

		configs.push({
			files: [GLOB_MARKDOWN],
			ignores: GLOB_SLIDEV,
			languageOptions: {
				parser: parserPlain,
			},
			name: 'xat/formatter/markdown',
			rules: {
				[`format/${formater}`]: [
					'error',
					formater === 'prettier'
						? mergePrettierOptions(prettierOptions, {
								embeddedLanguageFormatting: 'off',
								parser: 'markdown',
							})
						: {
								...dprintOptions,
								language: 'markdown',
							},
				],
			},
		})

		if (options.slidev) {
			configs.push({
				files: GLOB_SLIDEV,
				languageOptions: {
					parser: parserPlain,
				},
				name: 'xat/formatter/slidev',
				rules: {
					'format/prettier': [
						'error',
						mergePrettierOptions(prettierOptions, {
							embeddedLanguageFormatting: 'off',
							parser: 'slidev',
							plugins: [
								'prettier-plugin-slidev',
							],
						}),
					],
				},
			})
		}
	}

	if (options.astro) {
		configs.push({
			files: [GLOB_ASTRO],
			name: 'xat/formatter/astro',
			rules: {
				'format/prettier': [
					'error',
					mergePrettierOptions(prettierOptions, {
						parser: 'astro',
						plugins: [
							'prettier-plugin-astro',
						],
					}),
				],
			},
		})

		configs.push({
			files: [GLOB_ASTRO, GLOB_ASTRO_TS],
			name: 'xat/formatter/astro/disables',
			rules: {
				'style/arrow-parens': 'off',
				'style/block-spacing': 'off',
				'style/comma-dangle': 'off',
				'style/indent': 'off',
				'style/no-multi-spaces': 'off',
				'style/quotes': 'off',
				'style/semi': 'off',
			},
		})
	}

	if (options.graphql) {
		configs.push({
			files: [GLOB_GRAPHQL],
			languageOptions: {
				parser: parserPlain,
			},
			name: 'xat/formatter/graphql',
			rules: {
				'format/prettier': [
					'error',
					mergePrettierOptions(prettierOptions, {
						parser: 'graphql',
					}),
				],
			},
		})
	}

	return configs
}
