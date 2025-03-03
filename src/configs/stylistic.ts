import type { OptionsOverrides, StylisticConfig, TypedFlatConfigItem } from "@/types"

import { pluginStylistic } from "@/plugins"

export async function stylistic(
	options: StylisticConfig & OptionsOverrides = {},
): Promise<TypedFlatConfigItem[]> {
	const {
		indent = "tab",
		jsx,
		overrides = {},
		quotes = "double",
		semi = false,
	} = {
		...options,
	}

	const config = pluginStylistic.configs.customize({
		indent,
		jsx,
		quotes,
		semi,
	})

	return [
		{
			name: "xat/stylistic",
			plugins: {
				"@stylistic": pluginStylistic,
			},
			rules: {
				...config.rules,

				"@stylistic/generator-star-spacing": ["error", {
					after: true,
					before: false,
				}],
				"@stylistic/yield-star-spacing": ["error", {
					after: true,
					before: false,
				}],

				...overrides,
			},
		},
	]
}
