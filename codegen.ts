import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: "https://api.opencollective.com/graphql/v2",
    documents: "lib/oc/**/*.graphql",
    config: {
        assumeValid: true,
    },
    generates: {
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
