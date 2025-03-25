import type { OptionsFiles, OptionsOverrides, OptionsTypeScriptParserOptions, OptionsTypeScriptWithTypes, TypedFlatConfigItem } from "@/types"

import { isPackageExists } from "local-pkg"

import { GLOB_SRC, GLOB_TS, GLOB_TSX } from "@/constants"
import { pluginReact, pluginReactHooks, pluginReactRefresh } from "@/plugins"

// react refresh
const ReactRefreshAllowConstantExportPackages = [
	"vite",
]
const RemixPackages = [
	"@remix-run/node",
	"@remix-run/react",
	"@remix-run/serve",
	"@remix-run/dev",
]
const ReactRouterPackages = [
	"@react-router/node",
	"@react-router/react",
	"@react-router/serve",
	"@react-router/dev",
]
const NextJsPackages = [
	"next",
]

export async function react(
	options: OptionsFiles & OptionsOverrides & OptionsTypeScriptWithTypes & OptionsTypeScriptParserOptions = {},
): Promise<TypedFlatConfigItem[]> {
	const {
		files = [GLOB_SRC],
		filesTypeAware = [GLOB_TS, GLOB_TSX],
		ignoresTypeAware = [],
		overrides = {},
		tsconfigPath,
	} = options

	const isTypeAware = !!tsconfigPath

	const typeAwareRules: TypedFlatConfigItem["rules"] = {
		"@eslint-react/no-leaked-conditional-rendering": "warn",
	}

	const isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some(index => isPackageExists(index))
	const isUsingRemix = RemixPackages.some(index => isPackageExists(index))
	const isUsingReactRouter = ReactRouterPackages.some(index => isPackageExists(index))
	const isUsingNext = NextJsPackages.some(index => isPackageExists(index))

	const plugins = pluginReact.configs.all.plugins

	return [
		{
			name: "xat/react/setup",
			plugins: {
				"@eslint-react": plugins["@eslint-react"],
				"@eslint-react/dom": plugins["@eslint-react/dom"],
				"@eslint-react/hooks-extra": plugins["@eslint-react/hooks-extra"],
				"@eslint-react/naming-convention": plugins["@eslint-react/naming-convention"],
				"react-hooks": pluginReactHooks,
				"react-refresh": pluginReactRefresh,
				"react-web-api": plugins["@eslint-react/web-api"],
			},
		},
		{
			files,
			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
					...isTypeAware ? { project: tsconfigPath } : {},
				},
				sourceType: "module",
			},
			name: "xat/react/rules",
			rules: {

				// recommended rules from @eslint-react/dom
				"@eslint-react/dom/no-dangerously-set-innerhtml": "warn",
				"@eslint-react/dom/no-dangerously-set-innerhtml-with-children": "error",
				"@eslint-react/dom/no-find-dom-node": "error",
				"@eslint-react/dom/no-flush-sync": "error",
				"@eslint-react/dom/no-hydrate": "error",
				"@eslint-react/dom/no-missing-button-type": "warn",
				"@eslint-react/dom/no-missing-iframe-sandbox": "warn",
				"@eslint-react/dom/no-namespace": "error",
				"@eslint-react/dom/no-render": "warn",
				"@eslint-react/dom/no-render-return-value": "error",
				"@eslint-react/dom/no-script-url": "warn",
				"@eslint-react/dom/no-unsafe-iframe-sandbox": "warn",
				"@eslint-react/dom/no-unsafe-target-blank": "warn",
				"@eslint-react/dom/no-use-form-state": "error",
				"@eslint-react/dom/no-void-elements-with-children": "error",

				// recommended rules from eslint-plugin-react-hooks-extra
				"@eslint-react/hooks-extra/no-direct-set-state-in-use-effect": "warn",
				"@eslint-react/hooks-extra/no-unnecessary-use-prefix": "warn",

				// recommended rules from @eslint-react
				"@eslint-react/no-access-state-in-setstate": "error",
				"@eslint-react/no-array-index-key": "warn",
				"@eslint-react/no-children-count": "warn",
				"@eslint-react/no-children-for-each": "warn",
				"@eslint-react/no-children-map": "warn",
				"@eslint-react/no-children-only": "warn",
				"@eslint-react/no-children-to-array": "warn",
				"@eslint-react/no-clone-element": "warn",
				"@eslint-react/no-comment-textnodes": "warn",
				"@eslint-react/no-component-will-mount": "error",
				"@eslint-react/no-component-will-receive-props": "error",
				"@eslint-react/no-component-will-update": "error",
				"@eslint-react/no-context-provider": "warn",
				"@eslint-react/no-create-ref": "error",
				"@eslint-react/no-default-props": "error",
				"@eslint-react/no-direct-mutation-state": "error",
				"@eslint-react/no-duplicate-jsx-props": "warn",
				"@eslint-react/no-duplicate-key": "warn",
				"@eslint-react/no-forward-ref": "warn",
				"@eslint-react/no-implicit-key": "warn",
				"@eslint-react/no-missing-key": "error",
				"@eslint-react/no-nested-component-definitions": "warn",
				"@eslint-react/no-prop-types": "error",
				"@eslint-react/no-redundant-should-component-update": "error",
				"@eslint-react/no-set-state-in-component-did-mount": "warn",
				"@eslint-react/no-set-state-in-component-did-update": "warn",
				"@eslint-react/no-set-state-in-component-will-update": "warn",
				"@eslint-react/no-string-refs": "error",
				"@eslint-react/no-unsafe-component-will-mount": "warn",
				"@eslint-react/no-unsafe-component-will-receive-props": "warn",
				"@eslint-react/no-unsafe-component-will-update": "warn",
				"@eslint-react/no-unstable-context-value": "warn",
				"@eslint-react/no-unstable-default-props": "warn",
				"@eslint-react/no-unused-class-component-members": "warn",
				"@eslint-react/no-unused-state": "warn",
				"@eslint-react/no-use-context": "warn",

				"@eslint-react/no-useless-forward-ref": "warn",
				"@eslint-react/use-jsx-vars": "warn",

				// recommended rules react-hooks
				"react-hooks/exhaustive-deps": "warn",
				"react-hooks/rules-of-hooks": "error",

				// react refresh
				"react-refresh/only-export-components": [
					"warn",
					{
						allowConstantExport: isAllowConstantExport,
						allowExportNames: [
							...(isUsingNext
								? [
										"dynamic",
										"dynamicParams",
										"revalidate",
										"fetchCache",
										"runtime",
										"preferredRegion",
										"maxDuration",
										"config",
										"generateStaticParams",
										"metadata",
										"generateMetadata",
										"viewport",
										"generateViewport",
									]
								: []),
							...(isUsingRemix || isUsingReactRouter
								? [
										"meta",
										"links",
										"headers",
										"loader",
										"action",
									]
								: []),
						],
					},
				],

				// recommended rules from @eslint-react/web-api
				"react-web-api/no-leaked-event-listener": "warn",
				"react-web-api/no-leaked-interval": "warn",
				"react-web-api/no-leaked-resize-observer": "warn",
				"react-web-api/no-leaked-timeout": "warn",

				// overrides
				...overrides,
			},
		},
		...isTypeAware
			? [{
					files: filesTypeAware,
					ignores: ignoresTypeAware,
					name: "xat/react/type-aware",
					rules: {
						...typeAwareRules,
					},
				},
				]
			: [],
	]
}
