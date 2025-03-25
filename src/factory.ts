import type { Linter } from "eslint"

import type { Awaitable, ConfigNames, OptionsConfig, Rules, TypedFlatConfigItem } from "@/types"

import { FlatConfigComposer } from "eslint-flat-config-utils"
import { isPackageExists } from "local-pkg"

import {
	disable,
	html,
	ignore,
	imports,
	javascript,
	jsdoc,
	jsonc,
	jsx,
	node,
	perfectionist,
	react,
	regexp,
	sortPackageJson,
	sortTsconfig,
	stylistic,
	toml,
	typescript,
	unicorn,
	yaml } from "@/configs"
import { interopDefault, isInEditor } from "@/utils"

const flatConfigProperties = [
	"name",
	"languageOptions",
	"linterOptions",
	"processor",
	"plugins",
	"rules",
	"settings",
] satisfies (keyof TypedFlatConfigItem)[]

/**
 * Construct an array of ESLint flat config items.
 *
 * @param {OptionsConfig & TypedFlatConfigItem} options
 *  The options for generating the ESLint configurations.
 * @param {Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]} userConfigs
 *  The user configurations to be merged with the generated configurations.
 * @returns {Promise<TypedFlatConfigItem[]>}
 *  The merged ESLint configurations.
 */
export function xat(
	options: OptionsConfig & Omit<TypedFlatConfigItem, "files"> = {},
	...userConfigs: Awaitable<FlatConfigComposer<any, any> | Linter.Config[] | TypedFlatConfigItem | TypedFlatConfigItem[]>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
	const {
		componentExts: componentExtensions = [],
		gitignore: enableGitignore = true,
		html: enableHtml = true,
		jsonc: enableJsonc = true,
		jsx: enableJsx = true,
		react: enableReact = isPackageExists("react"),
		regexp: enableRegexp = true,
		toml: enableToml = true,
		typescript: enableTypeScript = isPackageExists("typescript"),
		unicorn: enableUnicorn = true,
		yaml: enableYaml = true,
	} = options

	let isEditor = options.isInEditor
	if (isEditor === undefined) {
		isEditor = isInEditor()
		if (isEditor)
		// eslint-disable-next-line no-console
			console.log("[@xats/eslint-config] Detected running in editor, some rules are disabled.")
	}

	const stylisticOptions = options.stylistic === false
		? false
		: (typeof options.stylistic === "object"
				? options.stylistic
				: {})

	if (stylisticOptions && !("jsx" in stylisticOptions))
		stylisticOptions.jsx = enableJsx

	const configs: Awaitable<TypedFlatConfigItem[]>[] = []

	if (enableGitignore) {
		if (typeof enableGitignore === "boolean") {
			configs.push(interopDefault(import("eslint-config-flat-gitignore")).then(r => [r({
				name: "xat/gitignore",
				strict: false,
			})]))
		}
		else {
			configs.push(interopDefault(import("eslint-config-flat-gitignore")).then(r => [r({
				name: "xat/gitignore",
				...enableGitignore,
			})]))
		}
	}

	const typescriptOptions = resolveSubOptions(options, "typescript")
	const tsconfigPath = "tsconfigPath" in typescriptOptions ? typescriptOptions.tsconfigPath : undefined

	// Base configs
	configs.push(
		ignore(options.ignores),
		javascript({
			isInEditor: isEditor,
			overrides: getOverrides(options, "javascript"),
		}),
		node(),
		jsdoc({
			stylistic: stylisticOptions,
		}),
		imports({
			stylistic: stylisticOptions,
		}),
		perfectionist(),
	)

	if (enableUnicorn) {
		configs.push(unicorn())
	}

	if (enableHtml) {
		configs.push(html({
			overrides: getOverrides(options, "html"),
			stylistic: stylisticOptions,
		}))
	}

	if (enableJsx) {
		configs.push(jsx())
	}

	if (enableTypeScript) {
		configs.push(typescript({
			...typescriptOptions,
			componentExts: componentExtensions,
			overrides: getOverrides(options, "typescript"),
			type: options.type,
		}))
	}

	if (stylisticOptions) {
		configs.push(stylistic({
			...stylisticOptions,
			overrides: getOverrides(options, "stylistic"),
		}))
	}

	// if (enableTailwindCSS) {
	// 	configs.push(tailwindcss({
	// 		overrides: getOverrides(options, "tailwindcss"),
	// 	}))
	// }

	if (enableRegexp) {
		configs.push(regexp(typeof enableRegexp === "boolean" ? {} : enableRegexp))
	}

	if (enableReact) {
		configs.push(react({
			...typescriptOptions,
			overrides: getOverrides(options, "react"),
			tsconfigPath,
		}))
	}

	if (enableJsonc) {
		configs.push(
			jsonc({
				overrides: getOverrides(options, "jsonc"),
				stylistic: stylisticOptions,
			}),
			sortPackageJson(),
			sortTsconfig(),
		)
	}

	if (enableYaml) {
		configs.push(yaml({
			overrides: getOverrides(options, "yaml"),
			stylistic: stylisticOptions,
		}))
	}

	if (enableToml) {
		configs.push(toml({
			overrides: getOverrides(options, "toml"),
			stylistic: stylisticOptions,
		}))
	}

	configs.push(
		disable(),
	)

	if ("files" in options) {
		throw new Error("[@xats/eslint-config] The first argument should not contain the \"files\" property as the options are supposed to be global. Place it in the second or later config instead.")
	}

	// User can optionally pass a flat config item to the first argument
	// We pick the known keys as ESLint would do schema validation
	const fusedConfig: TypedFlatConfigItem = {}
	for (const key of flatConfigProperties) {
		if (key in options)
			fusedConfig[key] = options[key] as any
	}
	if (Object.keys(fusedConfig).length > 0)
		configs.push([fusedConfig])

	let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>()

	composer = composer
		.append(
			...configs,
			...userConfigs as any,
		)

	if (isInEditor()) {
		composer = composer
			.disableRulesFix([
				"unused-imports/no-unused-imports",
				"prefer-const",
			], {
				builtinRules: () => import(["eslint", "use-at-your-own-risk"].join("/")).then(r => r.builtinRules),
			})
	}

	return composer
}

export type ResolvedOptions<T> = T extends boolean
	? never
	: NonNullable<T>

export function resolveSubOptions<K extends keyof OptionsConfig>(
	options: OptionsConfig,
	key: K,
): ResolvedOptions<OptionsConfig[K]> {
	return typeof options[key] === "boolean"
		? {} as any
		: options[key] || {} as any
}

export function getOverrides<K extends keyof OptionsConfig>(
	options: OptionsConfig,
	key: K,
): Partial<Rules & Linter.RulesRecord> {
	const sub = resolveSubOptions(options, key)
	return {
		..."overrides" in sub
			? sub.overrides
			: {},
	}
}
