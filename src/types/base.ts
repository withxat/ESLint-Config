import type { StylisticCustomizeOptions } from "@stylistic/eslint-plugin"
import type { ParserOptions } from "@typescript-eslint/parser"
import type { Linter } from "eslint"
import type { FlatGitignoreOptions } from "eslint-config-flat-gitignore"

import type { RuleOptions } from "@/types/modules/eslint"

export type Awaitable<T> = Promise<T> | T
export interface Rules extends RuleOptions {}

export type { ConfigNames } from "@/types/modules/eslint"

export type TypedFlatConfigItem = Omit<Linter.Config<Rules & Linter.RulesRecord>, "plugins"> & {
	// Relax plugins type limitation, as most of the plugins did not have correct type info yet.
	/**
	 * An object containing a name-value mapping of plugin names to plugin objects. When `files` is specified, these plugins are only available to the matching files.
	 *
	 * @see [Using plugins in your configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new#using-plugins-in-your-configuration)
	 */
	plugins?: Record<string, any>
}

export interface OptionsFiles {
	/**
	 * Override the `files` option to provide custom globs.
	 */
	files?: string[]
}

export type OptionsTypescript =
  (OptionsOverrides & OptionsTypeScriptParserOptions)
  | (OptionsOverrides & OptionsTypeScriptWithTypes)

export interface OptionsComponentExtensions {
	/**
	 * Additional extensions for components.
	 *
	 * @example ['vue']
	 * @default []
	 */
	componentExts?: string[]
}

export interface OptionsTypeScriptParserOptions {
	/**
	 * Glob patterns for files that should be type aware.
	 * @default ['**\/*.{ts,tsx}']
	 */
	filesTypeAware?: string[]

	/**
	 * Glob patterns for files that should not be type aware.
	 * @default []
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
	overridesTypeAware?: TypedFlatConfigItem["rules"]

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
	extends Pick<StylisticCustomizeOptions, "indent" | "jsx" | "quotes" | "semi"> {
}

export interface OptionsOverrides {
	overrides?: TypedFlatConfigItem["rules"]
}

export interface OptionsProjectType {
	/**
	 * Type of the project. `lib` will enable more strict rules for libraries.
	 *
	 * @default 'app'
	 */
	type?: "app" | "lib"
}

export interface OptionsRegExp {
	/**
	 * Override rulelevels
	 */
	level?: "error" | "warn"
}

export interface OptionsIsInEditor {
	isInEditor?: boolean
}

export interface OptionsConfig extends OptionsComponentExtensions, OptionsProjectType {
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
	 * Enable HTML support.
	 *
	 * @see https://github.com/BenoitZugmeyer/eslint-plugin-html
	 * @default true
	 */
	html?: boolean | OptionsOverrides

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
	 * Enable react rules.
	 *
	 * @default auto-detect based on the dependencies
	 */
	react?: boolean | OptionsOverrides

	/**
	 * Enable regexp rules.
	 *
	 * @see https://ota-meshi.github.io/eslint-plugin-regexp/
	 * @default true
	 */
	regexp?: boolean | (OptionsRegExp & OptionsOverrides)

	// /**
	//  * Enable Tailwind CSS rules.
	//  *
	//  * @see https://github.com/francoismassart/eslint-plugin-tailwindcss
	//  * @default auto-detect based on the dependencies
	//  */
	// tailwindcss?: boolean | OptionsOverrides

	/**
	 * Enable stylistic rules.
	 *
	 * @see https://eslint.style/
	 * @default true
	 */
	stylistic?: boolean | (StylisticConfig & OptionsOverrides)

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
	unicorn?: boolean

	/**
	 * Enable YAML support.
	 *
	 * @default true
	 */
	yaml?: boolean | OptionsOverrides
}
