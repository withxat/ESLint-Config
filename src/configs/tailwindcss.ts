import type { OptionsFiles, OptionsOverrides, OptionsStylistic, OptionsTailwindCSS, TypedFlatConfigItem } from '@/types'

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import { GLOB_ASTRO, GLOB_HTML, GLOB_SRC, GLOB_SVELTE } from '@/globs'
import { pluginBetterTailwindcss } from '@/plugins'

const TAILWIND_V4_ENTRY_CANDIDATES = [
	'src/app/globals.css',
	'src/app/global.css',
	'src/styles/globals.css',
	'src/styles/global.css',
	'src/styles/app.css',
	'src/styles/index.css',
	'src/styles/main.css',
	'src/index.css',
	'src/main.css',
	'src/app.css',
	'app/globals.css',
	'app/global.css',
	'app/styles/globals.css',
	'styles/globals.css',
	'styles/global.css',
	'styles/app.css',
	'styles/index.css',
	'styles/main.css',
]

const TAILWIND_V3_CONFIG_CANDIDATES = [
	'tailwind.config.ts',
	'tailwind.config.mts',
	'tailwind.config.cts',
	'tailwind.config.js',
	'tailwind.config.mjs',
	'tailwind.config.cjs',
]

const TAILWIND_IMPORT_REGEX = /@import\s+["']tailwindcss(?:\/[^"']*)?["']|@tailwind\s+(?:base|components|utilities)/

function detectTailwindV4Entry(cwd: string): string | undefined {
	for (const candidate of TAILWIND_V4_ENTRY_CANDIDATES) {
		const fullPath = path.join(cwd, candidate)
		try {
			const content = fs.readFileSync(fullPath, 'utf8')
			if (TAILWIND_IMPORT_REGEX.test(content)) {
				return candidate
			}
		}
		catch {}
	}
	return undefined
}

function detectTailwindV3Config(cwd: string): string | undefined {
	for (const candidate of TAILWIND_V3_CONFIG_CANDIDATES) {
		if (fs.existsSync(path.join(cwd, candidate))) {
			return candidate
		}
	}
	return undefined
}

function autodetectTailwindSettings(cwd: string): Record<string, unknown> {
	const entryPoint = detectTailwindV4Entry(cwd)
	if (entryPoint) {
		return { entryPoint }
	}
	const tailwindConfig = detectTailwindV3Config(cwd)
	if (tailwindConfig) {
		return { tailwindConfig }
	}
	return {}
}

export async function tailwindcss(
	options: OptionsFiles & OptionsOverrides & OptionsStylistic & OptionsTailwindCSS = {},
): Promise<TypedFlatConfigItem[]> {
	const {
		files = [GLOB_SRC, GLOB_SVELTE, GLOB_ASTRO, GLOB_HTML],
		overrides = {},
		settings: userSettings,
		stylistic = true,
	} = options

	const recommended = pluginBetterTailwindcss.configs!.recommended

	const detected = autodetectTailwindSettings(process.cwd())
	const mergedSettings = { ...detected, ...userSettings }
	const hasSettings = Object.keys(mergedSettings).length > 0

	const {
		indent = 'tab',
	} = typeof stylistic === 'boolean' ? {} : stylistic

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
				'better-tailwindcss/enforce-consistent-line-wrapping': ['warn', {
					classesPerLine: 10,
					indent: typeof indent === 'number' ? indent : 'tab',
					printWidth: 0,
				}],

				...overrides,
			},
			...hasSettings ? { settings: { 'better-tailwindcss': mergedSettings } } : {},
		},
	]
}
