import type { OptionsStylistic, TypedFlatConfigItem } from "@/types"

import { pluginImport } from "@/plugins"

export async function imports(options: OptionsStylistic = {}): Promise<TypedFlatConfigItem[]> {
	const {
		stylistic = true,
	} = options

	return [
		{
			name: "xat/imports",
			plugins: {
				"import-x": pluginImport,
			},
			rules: {
				"import-x/consistent-type-specifier-style": ["error", "prefer-top-level"],
				"import-x/first": "error",
				"import-x/no-duplicates": "error",
				"import-x/no-mutable-exports": "error",
				"import-x/no-named-default": "error",
				"import-x/no-self-import": "error",
				"import-x/no-webpack-loader-syntax": "error",

				...stylistic
					? {
							"import-x/newline-after-import": ["error", { count: 1 }],
						}
					: {},
			},
		},
	]
}
