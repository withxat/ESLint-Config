import fs from "node:fs/promises"

import { flatConfigsToRulesDTS } from "eslint-typegen/core"
import { builtinRules } from "eslint/use-at-your-own-risk"

import { html, imports, javascript, jsdoc, jsonc, jsx, node, perfectionist, react, regexp, sortPackageJson, stylistic, /* tailwindcss, */ toml, typescript, unicorn, yaml } from "@/configs"
import { combine } from "@/utils"

const configs = await combine(
	{
		plugins: {
			"": {
				rules: Object.fromEntries(builtinRules.entries()),
			},
		},
	},
	imports(),
	javascript(),
	jsx(),
	jsdoc(),
	html(),
	jsonc(),
	node(),
	perfectionist(),
	react(),
	sortPackageJson(),
	stylistic(),
	// tailwindcss(),
	toml(),
	regexp(),
	typescript(),
	unicorn(),
	yaml(),
)

const configNames = configs.map(index => index.name).filter(Boolean) as string[]

let dts = await flatConfigsToRulesDTS(configs, {
	includeAugmentation: false,
	includeIgnoreComments: false,
})

dts += `
// Names of all the configs
export type ConfigNames = ${configNames.map(index => `'${index}'`).join(" | ")}
`

await fs.writeFile("src/types/modules/eslint.d.ts", dts)
