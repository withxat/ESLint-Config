import type { OptionsPnpm, TypedFlatConfigItem } from '@/types'

import { interopDefault } from '@/utils'

// import fs from 'node:fs/promises'
// import { findUp } from 'find-up-simple'

// async function detectCatalogUsage(): Promise<boolean> {
// 	const workspaceFile = await findUp('pnpm-workspace.yaml')
// 	if (!workspaceFile)
// 		return false

// 	const yaml = await fs.readFile(workspaceFile, 'utf-8')
// 	return yaml.includes('catalog:') || yaml.includes('catalogs:')
// }

export async function pnpm(
	options: OptionsPnpm,
): Promise<TypedFlatConfigItem[]> {
	const [
		pluginPnpm,
		yamlParser,
	] = await Promise.all([
		interopDefault(import('eslint-plugin-pnpm')),
		interopDefault(import('eslint-plugin-yml')),
		interopDefault(import('yaml-eslint-parser')),
	])

	const {
		catalogs = false,
		isInEditor = false,
		json = true,
		sort = true,
		yaml = true,
	} = options

	const configs: TypedFlatConfigItem[] = []

	configs.push({
		name: 'xat/pnpm/setup',
		plugins: {
			pnpm: pluginPnpm,
		},
	})

	if (json) {
		configs.push(
			{
				files: [
					'package.json',
					'**/package.json',
				],
				language: 'jsonc/x',
				name: 'xat/pnpm/package-json',
				rules: {
					...(catalogs
						? {
								'pnpm/json-enforce-catalog': [
									'error',
									{
										autofix: !isInEditor,
										ignores: ['@types/vscode'],
									},
								],
							}
						: {}),
					'pnpm/json-prefer-workspace-settings': [
						'error',
						{ autofix: !isInEditor },
					],
					'pnpm/json-valid-catalog': [
						'error',
						{ autofix: !isInEditor },
					],
				},
			},
		)
	}

	if (yaml) {
		configs.push({
			files: ['pnpm-workspace.yaml'],
			languageOptions: {
				parser: yamlParser,
			},
			name: 'xat/pnpm/pnpm-workspace-yaml',
			rules: {
				'pnpm/yaml-enforce-settings': ['error', {
					settings: {
						shellEmulator: true,
						trustPolicy: 'no-downgrade',
					},
				}],
				'pnpm/yaml-no-duplicate-catalog-item': 'error',
				'pnpm/yaml-no-unused-catalog-item': 'error',
			},
		})

		if (sort) {
			configs.push({
				files: ['pnpm-workspace.yaml'],
				languageOptions: {
					parser: yamlParser,
				},
				name: 'xat/pnpm/pnpm-workspace-yaml-sort',
				rules: {
					'yaml/sort-keys': [
						'error',
						{
							order: [
								// Settings
								// @keep-sorted
								...[
									'cacheDir',
									'catalogMode',
									'cleanupUnusedCatalogs',
									'dedupeDirectDeps',
									'deployAllFiles',
									'enablePrePostScripts',
									'engineStrict',
									'extendNodePath',
									'hoist',
									'hoistPattern',
									'hoistWorkspacePackages',
									'ignoreCompatibilityDb',
									'ignoreDepScripts',
									'ignoreScripts',
									'ignoreWorkspaceRootCheck',
									'managePackageManagerVersions',
									'minimumReleaseAge',
									'minimumReleaseAgeExclude',
									'modulesDir',
									'nodeLinker',
									'nodeVersion',
									'optimisticRepeatInstall',
									'packageManagerStrict',
									'packageManagerStrictVersion',
									'preferSymlinkedExecutables',
									'preferWorkspacePackages',
									'publicHoistPattern',
									'registrySupportsTimeField',
									'requiredScripts',
									'resolutionMode',
									'savePrefix',
									'scriptShell',
									'shamefullyHoist',
									'shellEmulator',
									'stateDir',
									'supportedArchitectures',
									'symlink',
									'tag',
									'trustPolicy',
									'trustPolicyExclude',
									'updateNotifier',
								],

								// Packages and dependencies
								'packages',
								'overrides',
								'patchedDependencies',
								'catalog',
								'catalogs',

								// Other
								// @keep-sorted
								...[
									'allowedDeprecatedVersions',
									'allowNonAppliedPatches',
									'configDependencies',
									'ignoredBuiltDependencies',
									'ignoredOptionalDependencies',
									'neverBuiltDependencies',
									'onlyBuiltDependencies',
									'onlyBuiltDependenciesFile',
									'packageExtensions',
									'peerDependencyRules',
								],
							],
							pathPattern: '^$',
						},
						{
							order: { type: 'asc' },
							pathPattern: '.*',
						},
					],
				},
			})
		}
	}

	return configs
}
