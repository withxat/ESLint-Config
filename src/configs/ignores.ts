import type { TypedFlatConfigItem } from '@/types'

import { GLOB_EXCLUDE, GLOB_TS, GLOB_TSX } from '@/globs'

export async function ignores(
	userIgnores: ((originals: string[]) => string[]) | string[] = [],
	ignoreTypeScript: boolean = false,
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

	return [
		{
			ignores,
			name: 'xat/ignores',
		},
	] as const
}
