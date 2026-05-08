import type { TypedFlatConfigItem } from '@/types'

import { GLOB_EXCLUDE, GLOB_MARKDOWN, GLOB_TS, GLOB_TSX } from '@/globs'

export async function ignores(
	userIgnores: ((originals: string[]) => string[]) | string[] = [],
	ignoreTypeScript: boolean = false,
	ignoreMarkdown: boolean = false,
): Promise<TypedFlatConfigItem[]> {
	let ignores = [
		...GLOB_EXCLUDE,
	]

	if (ignoreTypeScript) {
		ignores.push(GLOB_TS, GLOB_TSX)
	}

	if (typeof userIgnores === 'function') {
		ignores = userIgnores(ignores)
	}
	else {
		ignores = [
			...ignores,
			...userIgnores,
		]
	}

	if (ignoreMarkdown) {
		ignores.push(GLOB_MARKDOWN)
	}

	return [
		{
			ignores,
			name: 'xat/ignores',
		},
	] as const
}
