import { execSync } from 'node:child_process'

export function isGitClean(): boolean {
	try {
		execSync('git diff-index --quiet HEAD --')
		return true
	}
	catch {
		return false
	}
}

export function getEslintConfigContent(
	mainConfig: string,
	additionalConfigs?: string[],
): string {
	return `
import { xat } from '@xats/eslint-config'

export default xat({
${mainConfig}
}${additionalConfigs?.map(config => `,{\n${config}\n}`)})
`.trimStart()
}
