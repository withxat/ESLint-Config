import type { OptionsFiles, OptionsOverrides, OptionsTailwindCSS, TypedFlatConfigItem } from '@/types'

import { GLOB_ASTRO, GLOB_HTML, GLOB_SRC, GLOB_SVELTE } from '@/globs'
import { pluginBetterTailwindcss } from '@/plugins'

export async function tailwindcss(
	options: OptionsFiles & OptionsOverrides & OptionsTailwindCSS = {},
): Promise<TypedFlatConfigItem[]> {
	const {
		files = [GLOB_SRC, GLOB_SVELTE, GLOB_ASTRO, GLOB_HTML],
		overrides = {},
		settings,
	} = options

	const recommended = pluginBetterTailwindcss.configs!.recommended

	return [
		{
			name: 'xat/tailwindcss/setup',
			plugins: {
				'better-tailwindcss': pluginBetterTailwindcss,
			},
		},
		{
			files,
			name: 'xat/tailwindcss/rules',
			rules: {
				...recommended.rules,
				...overrides,
			},
			...settings ? { settings: { 'better-tailwindcss': settings } } : {},
		},
	]
}
