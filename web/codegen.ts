import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	overwrite: true,
	schema: 'http://localhost:3000/graphql',
	documents: 'src/graphql/**/*',
	generates: {
		'src/generated/graphql.tsx': {
			plugins: ['typescript', 'typescript-operations', 'typescript-urql'],
		},
	},
};

export default config;
