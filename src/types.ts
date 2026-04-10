import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin'
import type { ParserOptions } from '@typescript-eslint/parser'
import type { Linter } from 'eslint'
import type { FlatGitignoreOptions } from 'eslint-config-flat-gitignore'
import type { ConfigWithExtends } from 'eslint-flat-config-utils'

import type { ConfigNames, RuleOptions } from '@/typegen'
import type { VendoredPrettierOptions } from '@/vender/prettier-types'

export type Awaitable<T> = Promise<T> | T

export type Rules = RuleOptions & Record<string, Linter.RuleEntry<any> | undefined>

export type { ConfigNames, RuleOptions }

export type TypedFlatConfigItem = Omit<ConfigWithExtends, 'plugins' | 'rules'> & {
	// Relax plugins type limitation, as most of the plugins did not have correct type info yet.
	/**
	 * An object containing a name-value mapping of plugin names to plugin objects. When `files` is specified, these plugins are only available to the matching files.
	 *
	 * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
	 */
	plugins?: Record<string, any>

	/**
	 * Rules configuration. More flexible to allow plugin rules that may not be perfectly typed.
	 */
	rules?: Rules
}

export interface OptionsFiles {
	/**
	 * Override the `files` option to provide custom globs.
	 */
	files?: string[]
}

export type OptionsTypescript
	= (OptionsOverrides & OptionsTypeScriptParserOptions)
		| (OptionsOverrides & OptionsTypeScriptWithTypes)

export interface OptionsFormatters {
	/**
	 * Enable formatting support for CSS, Less, Sass, and SCSS.
	 *
	 * Currently only support Prettier.
	 */
	css?: 'prettier' | boolean

	/**
	 * Custom options for dprint.
	 *
	 * By default it's controlled by our own config.
	 */
	dprintOptions?: boolean

	/**
	 * Enable formatting support for GraphQL.
	 */
	graphql?: 'prettier' | boolean

	/**
	 * Enable formatting support for HTML.
	 *
	 * Currently only support Prettier.
	 */
	html?: 'prettier' | boolean

	/**
	 * Enable formatting support for Markdown.
	 *
	 * Support both Prettier and dprint.
	 *
	 * When set to `true`, it will use Prettier.
	 */
	markdown?: 'dprint' | 'prettier' | boolean

	/**
	 * Custom options for Prettier.
	 *
	 * By default it's controlled by our own config.
	 */
	prettierOptions?: VendoredPrettierOptions

	/**
	 * Enable formatting support for SVG.
	 *
	 * Currently only support Prettier.
	 */
	svg?: 'prettier' | boolean

	/**
	 * Enable formatting support for XML.
	 *
	 * Currently only support Prettier.
	 */
	xml?: 'prettier' | boolean
}

export interface OptionsComponentExts {
	/**
	 * Additional extensions for components.
	 *
	 * @example ['vue']
	 * @default []
	 */
	componentExts?: string[]
}

export interface OptionsUnicorn extends OptionsOverrides {
	/**
	 * Include all rules recommended by `eslint-plugin-unicorn`, instead of only ones picked by Anthony.
	 *
	 * @default false
	 */
	allRecommended?: boolean
}

export interface OptionsMarkdown extends OptionsOverrides {
	/**
	 * Enable GFM (GitHub Flavored Markdown) support.
	 *
	 * @default true
	 */
	gfm?: boolean

	/**
	 * Override rules for markdown itself.
	 */
	overridesMarkdown?: TypedFlatConfigItem['rules']
}

export interface OptionsTypeScriptParserOptions {
	/**
	 * Glob patterns for files that should be type aware.
	 * @default ['**\/*.{ts,tsx}']
	 */
	filesTypeAware?: string[]

	/**
	 * Glob patterns for files that should not be type aware.
	 * @default ['**\/*.md\/**', '**\/*.astro/*.ts']
	 */
	ignoresTypeAware?: string[]

	/**
	 * Additional parser options for TypeScript.
	 */
	parserOptions?: Partial<ParserOptions>
}

export interface OptionsTypeScriptWithTypes {
	/**
	 * Override type aware rules.
	 */
	overridesTypeAware?: TypedFlatConfigItem['rules']

	/**
	 * When this options is provided, type aware rules will be enabled.
	 * @see https://typescript-eslint.io/linting/typed-linting/
	 */
	tsconfigPath?: string
}

export interface OptionsHasTypeScript {
	typescript?: boolean
}

export interface OptionsStylistic {
	stylistic?: boolean | StylisticConfig
}

export interface StylisticConfig
	extends Pick<StylisticCustomizeOptions, 'indent' | 'jsx' | 'quotes' | 'semi'> {
}

export interface OptionsOverrides {
	overrides?: TypedFlatConfigItem['rules']
}

export interface OptionsProjectType {
	/**
	 * Type of the project. `lib` will enable more strict rules for libraries.
	 *
	 * @default 'app'
	 */
	type?: 'app' | 'lib'
}

export interface OptionsRegExp {
	/**
	 * Override rulelevels
	 */
	level?: 'error' | 'warn'
}

export interface OptionsE18e extends OptionsOverrides {
	/**
	 * Include modernization rules
	 *
	 * @see https://github.com/e18e/eslint-plugin#modernization
	 * @default true
	 */
	modernization?: boolean
	/**
	 * Include module replacements rules
	 *
	 * @see https://github.com/e18e/eslint-plugin#module-replacements
	 * @default type === 'lib' && isInEditor
	 */
	moduleReplacements?: boolean
	/**
	 * Include performance improvements rules
	 *
	 * @see https://github.com/e18e/eslint-plugin#performance-improvements
	 * @default true
	 */
	performanceImprovements?: boolean
}

export interface OptionsPnpm extends OptionsIsInEditor {
	/**
	 * Requires catalogs usage
	 *
	 * Detects automatically based if `catalogs` is used in the pnpm-workspace.yaml file
	 */
	catalogs?: boolean

	/**
	 * Enable linting for package.json, will install the jsonc parser
	 *
	 * @default true
	 */
	json?: boolean

	/**
	 * Sort entries in pnpm-workspace.yaml
	 *
	 * @default false
	 */
	sort?: boolean

	/**
	 * Enable linting for pnpm-workspace.yaml, will install the yaml parser
	 *
	 * @default true
	 */
	yaml?: boolean
}

export interface OptionsIsInEditor {
	isInEditor?: boolean
}

export interface OptionsUnoCSS extends OptionsOverrides {
	/**
	 * Enable attributify support.
	 * @default true
	 */
	attributify?: boolean
	/**
	 * Enable strict mode by throwing errors about blocklisted classes.
	 * @default false
	 */
	strict?: boolean
}

export interface OptionsConfig extends OptionsComponentExts, OptionsProjectType {
	/**
	 * Enable ASTRO support.
	 *
	 * Requires installing:
	 * - `eslint-plugin-astro`
	 *
	 * Requires installing for formatting .astro:
	 * - `prettier-plugin-astro`
	 *
	 * @default auto-detect based on the presence of a astro package.json file
	 */
	astro?: boolean | OptionsOverrides

	/**
	 * Automatically rename plugins in the config.
	 *
	 * @default true
	 */
	autoRenamePlugins?: boolean

	/**
	 * Options for [@e18e/eslint-plugin](https://github.com/e18e/eslint-plugin)
	 *
	 * @default true
	 */
	e18e?: boolean | OptionsE18e

	/**
	 * Use external formatters to format files.
	 *
	 * Requires installing:
	 * - `eslint-plugin-format`
	 *
	 * When set to `true`, it will enable all formatters.
	 *
	 * @default false
	 */
	formatters?: boolean | OptionsFormatters

	/**
	 * Enable gitignore support.
	 *
	 * Passing an object to configure the options.
	 *
	 * @see https://github.com/antfu/eslint-config-flat-gitignore
	 * @default true
	 */
	gitignore?: boolean | FlatGitignoreOptions

	/**
	 * Options for eslint-plugin-import-lite.
	 *
	 * @default true
	 */
	imports?: boolean | OptionsOverrides

	/**
	 * Control to disable some rules in editors.
	 * @default auto-detect based on the process.env
	 */
	isInEditor?: boolean
	/**
	 * Core rules. Can't be disabled.
	 */
	javascript?: OptionsOverrides

	/**
	 * Enable JSONC support.
	 *
	 * @default true
	 */
	jsonc?: boolean | OptionsOverrides

	/**
	 * Enable JSX related rules.
	 *
	 * Currently only stylistic rules are included.
	 *
	 * @default true
	 */
	jsx?: boolean

	/**
	 * Enable linting for **code snippets** in Markdown and the markdown content itself.
	 *
	 * For formatting Markdown content, enable also `formatters.markdown`.
	 *
	 * @default true
	 */
	markdown?: boolean | OptionsMarkdown

	/**
	 * Enable nextjs rules.
	 *
	 * Requires installing:
	 * - `@next/eslint-plugin-next`
	 *
	 * @default auto-detect based on the presence of a next package.json file
	 */
	nextjs?: boolean | OptionsOverrides

	/**
	 * Enable import paths alias support.
	 *
	 * @default true
	 */
	paths?: boolean

	/**
	 * Enable pnpm (workspace/catalogs) support.
	 *
	 * @see https://github.com/antfu/pnpm-workspace-utils
	 * @default auto-detect based on the presence of a pnpm-workspace.yaml file
	 */
	pnpm?: boolean | OptionsPnpm

	/**
	 * Enable react rules.
	 *
	 * Requires installing:
	 * - `@eslint-react/eslint-plugin`
	 * - `eslint-plugin-react-refresh`
	 *
	 * @default auto-detect based on the presence of a react package.json file
	 */
	react?: boolean | OptionsOverrides

	/**
	 * Enable regexp rules.
	 *
	 * @see https://ota-meshi.github.io/eslint-plugin-regexp/
	 * @default true
	 */
	regexp?: boolean | (OptionsRegExp & OptionsOverrides)

	/**
	 * Enable stylistic rules.
	 *
	 * @see https://eslint.style/
	 * @default true
	 */
	stylistic?: boolean | (StylisticConfig & OptionsOverrides)

	/**
	 * Enable svelte rules.
	 *
	 * Requires installing:
	 * - `eslint-plugin-svelte`
	 *
	 * @default auto-detect based on the presence of a svelte package.json file
	 */
	svelte?: boolean | OptionsOverrides

	/**
	 * Enable test support.
	 *
	 * @default true
	 */
	test?: boolean | OptionsOverrides

	/**
	 * Enable TOML support.
	 *
	 * @default true
	 */
	toml?: boolean | OptionsOverrides

	/**
	 * Enable TypeScript support.
	 *
	 * Passing an object to enable TypeScript Language Server support.
	 *
	 * @default auto-detect based on the dependencies
	 */
	typescript?: boolean | OptionsTypescript

	/**
	 * Options for eslint-plugin-unicorn.
	 *
	 * @default true
	 */
	unicorn?: boolean | OptionsUnicorn

	/**
	 * Enable YAML support.
	 *
	 * @default true
	 */
	yaml?: boolean | OptionsOverrides
}
