import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: "https://api.opencollective.com/graphql/v2",
    documents: "lib/oc/**/*.graphql",
    generates: {
        "./lib/oc/generated/types.ts": {
            config: {
                useTypeImports: true,
                namingConvention: {
                    enumValues: "keep",
                },
            },
            plugins: ["typescript"],
        },
        "./lib/oc/generated/operations.ts": {
            config: {
                useTypeImports: true,
                namingConvention: {
                    enumValues: "keep",
                },
            },
            plugins: ["typescript-operations", "typed-document-node"],
        },
    },
};

export default config;
