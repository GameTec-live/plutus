/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
    | T
    | {
          [P in keyof T]?: P extends " $fragmentName" | "__typename"
              ? T[P]
              : never;
      };

import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type AccountReferenceInput = {
    /** The public id identifying the account (ie: dgm9bnk8-0437xqry-ejpvzeol-jdayw5re, acc_xxxxxxxx) */
    id?: string | null | undefined;
    /** The slug identifying the account (ie: babel for https://opencollective.com/babel) */
    slug?: string | null | undefined;
};

/** All supported currencies */
export type Currency =
    /** UAE Dirham */
    | "AED"
    /** Afghani */
    | "AFN"
    /** Lek */
    | "ALL"
    /** Armenian Dram */
    | "AMD"
    /** Netherlands Antillean Guilder */
    | "ANG"
    /** Kwanza */
    | "AOA"
    /** Argentine Peso */
    | "ARS"
    /** Australian Dollar */
    | "AUD"
    /** Aruban Florin */
    | "AWG"
    /** Azerbaijanian Manat */
    | "AZN"
    /** Convertible Mark */
    | "BAM"
    /** Barbados Dollar */
    | "BBD"
    /** Taka */
    | "BDT"
    /** Bulgarian Lev */
    | "BGN"
    /** Burundi Franc */
    | "BIF"
    /** Bermudian Dollar */
    | "BMD"
    /** Brunei Dollar */
    | "BND"
    /** Boliviano */
    | "BOB"
    /** Brazilian Real */
    | "BRL"
    /** Bahamian Dollar */
    | "BSD"
    /** Pula */
    | "BWP"
    /** Belarussian Ruble */
    | "BYN"
    /** Belize Dollar */
    | "BZD"
    /** Canadian Dollar */
    | "CAD"
    /** Congolese Franc */
    | "CDF"
    /** Swiss Franc */
    | "CHF"
    /** Chilean Peso */
    | "CLP"
    /** Yuan Renminbi */
    | "CNY"
    /** Colombian Peso */
    | "COP"
    /** Costa Rican Colon */
    | "CRC"
    /** Cabo Verde Escudo */
    | "CVE"
    /** Czech Koruna */
    | "CZK"
    /** Djibouti Franc */
    | "DJF"
    /** Danish Krone */
    | "DKK"
    /** Dominican Peso */
    | "DOP"
    /** Algerian Dinar */
    | "DZD"
    /** Egyptian Pound */
    | "EGP"
    /** Ethiopian Birr */
    | "ETB"
    /** Euro */
    | "EUR"
    /** Fiji Dollar */
    | "FJD"
    /** Falkland Islands Pound */
    | "FKP"
    /** Pound Sterling */
    | "GBP"
    /** Lari */
    | "GEL"
    /** Ghana Cedi */
    | "GHS"
    /** Gibraltar Pound */
    | "GIP"
    /** Dalasi */
    | "GMD"
    /** Guinea Franc */
    | "GNF"
    /** Quetzal */
    | "GTQ"
    /** Guyana Dollar */
    | "GYD"
    /** Hong Kong Dollar */
    | "HKD"
    /** Lempira */
    | "HNL"
    /** Kuna */
    | "HRK"
    /** Gourde */
    | "HTG"
    /** Forint */
    | "HUF"
    /** Rupiah */
    | "IDR"
    /** New Israeli Sheqel */
    | "ILS"
    /** Indian Rupee */
    | "INR"
    /** Iceland Krona */
    | "ISK"
    /** Jamaican Dollar */
    | "JMD"
    /** Yen */
    | "JPY"
    /** Kenyan Shilling */
    | "KES"
    /** Som */
    | "KGS"
    /** Riel */
    | "KHR"
    /** Comoro Franc */
    | "KMF"
    /** Won */
    | "KRW"
    /** Cayman Islands Dollar */
    | "KYD"
    /** Tenge */
    | "KZT"
    /** Kip */
    | "LAK"
    /** Lebanese Pound */
    | "LBP"
    /** Sri Lanka Rupee */
    | "LKR"
    /** Liberian Dollar */
    | "LRD"
    /** Loti */
    | "LSL"
    /** Moroccan Dirham */
    | "MAD"
    /** Moldovan Leu */
    | "MDL"
    /** Malagasy Ariary */
    | "MGA"
    /** Denar */
    | "MKD"
    /** Kyat */
    | "MMK"
    /** Tugrik */
    | "MNT"
    /** Pataca */
    | "MOP"
    /** Mauritius Rupee */
    | "MUR"
    /** Rufiyaa */
    | "MVR"
    /** Kwacha */
    | "MWK"
    /** Mexican Peso */
    | "MXN"
    /** Malaysian Ringgit */
    | "MYR"
    /** Mozambique Metical */
    | "MZN"
    /** Namibia Dollar */
    | "NAD"
    /** Naira */
    | "NGN"
    /** Cordoba Oro */
    | "NIO"
    /** Norwegian Krone */
    | "NOK"
    /** Nepalese Rupee */
    | "NPR"
    /** New Zealand Dollar */
    | "NZD"
    /** Balboa */
    | "PAB"
    /** Nuevo Sol */
    | "PEN"
    /** Kina */
    | "PGK"
    /** Philippine Peso */
    | "PHP"
    /** Pakistan Rupee */
    | "PKR"
    /** Zloty */
    | "PLN"
    /** Guarani */
    | "PYG"
    /** Qatari Rial */
    | "QAR"
    /** Romanian Leu */
    | "RON"
    /** Serbian Dinar */
    | "RSD"
    /** Russian Ruble */
    | "RUB"
    /** Rwanda Franc */
    | "RWF"
    /** Saudi Riyal */
    | "SAR"
    /** Solomon Islands Dollar */
    | "SBD"
    /** Seychelles Rupee */
    | "SCR"
    /** Swedish Krona */
    | "SEK"
    /** Singapore Dollar */
    | "SGD"
    /** Saint Helena Pound */
    | "SHP"
    /** Leone */
    | "SLL"
    /** Somali Shilling */
    | "SOS"
    /** Surinam Dollar */
    | "SRD"
    /** Lilangeni */
    | "SZL"
    /** Baht */
    | "THB"
    /** Somoni */
    | "TJS"
    /** Pa’anga */
    | "TOP"
    /** Turkish Lira */
    | "TRY"
    /** Trinidad and Tobago Dollar */
    | "TTD"
    /** New Taiwan Dollar */
    | "TWD"
    /** Tanzanian Shilling */
    | "TZS"
    /** Hryvnia */
    | "UAH"
    /** Uganda Shilling */
    | "UGX"
    /** US Dollar */
    | "USD"
    /** Peso Uruguayo */
    | "UYU"
    /** Uzbekistan Sum */
    | "UZS"
    /** Dong */
    | "VND"
    /** Vatu */
    | "VUV"
    /** Tala */
    | "WST"
    /** CFA Franc BEAC */
    | "XAF"
    /** East Caribbean Dollar */
    | "XCD"
    /** CFA Franc BCEAO */
    | "XOF"
    /** CFP Franc */
    | "XPF"
    /** Yemeni Rial */
    | "YER"
    /** Rand */
    | "ZAR"
    /** Zambian Kwacha */
    | "ZMW";

export type ProjectCreateInput = {
    /** The profile background image, for the banner and social media sharing */
    backgroundImage?: unknown;
    description: string;
    /** The profile avatar image */
    image?: unknown;
    name: string;
    settings?: unknown;
    slug: string;
    /** The social links in order of preference */
    socialLinks?: Array<SocialLinkInput> | null | undefined;
    tags?: Array<string | null | undefined> | null | undefined;
};

export type SocialLinkInput = {
    type: SocialLinkType;
    url: unknown;
};

/** The type of social link */
export type SocialLinkType =
    | "BLUESKY"
    | "DISCORD"
    | "DISCOURSE"
    | "FACEBOOK"
    | "GHOST"
    | "GIT"
    | "GITHUB"
    | "GITLAB"
    | "INSTAGRAM"
    | "LINKEDIN"
    | "MASTODON"
    | "MATTERMOST"
    | "MEETUP"
    | "PEERTUBE"
    | "PIXELFED"
    | "SLACK"
    | "THREADS"
    | "TIKTOK"
    | "TUMBLR"
    | "TWITCH"
    | "TWITTER"
    | "WEBSITE"
    | "YOUTUBE";

export type GetProjectBalanceByProjectIdQueryVariables = Exact<{
    slug?: string | null | undefined;
}>;

export type GetProjectBalanceByProjectIdQuery = {
    project: {
        stats: {
            id: string | null;
            balance: { valueInCents: number | null; currency: Currency | null };
        } | null;
    } | null;
};

export type GetProjectForCreationRecoveryQueryVariables = Exact<{
    slug?: string | null | undefined;
}>;

export type GetProjectForCreationRecoveryQuery = {
    project: {
        id: string;
        slug: string;
        name: string | null;
        parent:
            | { slug: string }
            | { slug: string }
            | { slug: string }
            | { slug: string }
            | { slug: string }
            | { slug: string }
            | { slug: string }
            | { slug: string }
            | { slug: string }
            | null;
    } | null;
};

export type GetCollectiveCurrencyQueryVariables = Exact<{
    slug?: string | null | undefined;
}>;

export type GetCollectiveCurrencyQuery = {
    account:
        | { currency: Currency }
        | { currency: Currency }
        | { currency: Currency }
        | { currency: Currency }
        | { currency: Currency }
        | { currency: Currency }
        | { currency: Currency }
        | { currency: Currency }
        | { currency: Currency }
        | null;
};

export type CreateOpenCollectiveProjectMutationVariables = Exact<{
    project: ProjectCreateInput;
    parent?: AccountReferenceInput | null | undefined;
    disableContributions: boolean;
    disableExpenses: boolean;
}>;

export type CreateOpenCollectiveProjectMutation = {
    createProject: {
        id: string;
        slug: string;
        name: string | null;
        parent:
            | { slug: string }
            | { slug: string }
            | { slug: string }
            | { slug: string }
            | { slug: string }
            | { slug: string }
            | { slug: string }
            | { slug: string }
            | { slug: string }
            | null;
    } | null;
};

export type DeleteOpenCollectiveProjectMutationVariables = Exact<{
    account: AccountReferenceInput;
}>;

export type DeleteOpenCollectiveProjectMutation = {
    deleteAccount:
        | { id: string; slug: string }
        | { id: string; slug: string }
        | { id: string; slug: string }
        | { id: string; slug: string }
        | { id: string; slug: string }
        | { id: string; slug: string }
        | { id: string; slug: string }
        | { id: string; slug: string }
        | { id: string; slug: string }
        | null;
};

export const GetProjectBalanceByProjectIdDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetProjectBalanceByProjectId" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "slug" },
                    },
                    type: {
                        kind: "NamedType",
                        name: { kind: "Name", value: "String" },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "project" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "slug" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "slug" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "stats" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "id",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "balance",
                                                },
                                                selectionSet: {
                                                    kind: "SelectionSet",
                                                    selections: [
                                                        {
                                                            kind: "Field",
                                                            name: {
                                                                kind: "Name",
                                                                value: "valueInCents",
                                                            },
                                                        },
                                                        {
                                                            kind: "Field",
                                                            name: {
                                                                kind: "Name",
                                                                value: "currency",
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    GetProjectBalanceByProjectIdQuery,
    GetProjectBalanceByProjectIdQueryVariables
>;
export const GetProjectForCreationRecoveryDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetProjectForCreationRecovery" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "slug" },
                    },
                    type: {
                        kind: "NamedType",
                        name: { kind: "Name", value: "String" },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "project" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "slug" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "slug" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "slug" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "parent" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "slug",
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    GetProjectForCreationRecoveryQuery,
    GetProjectForCreationRecoveryQueryVariables
>;
export const GetCollectiveCurrencyDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetCollectiveCurrency" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "slug" },
                    },
                    type: {
                        kind: "NamedType",
                        name: { kind: "Name", value: "String" },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "account" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "slug" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "slug" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "currency" },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    GetCollectiveCurrencyQuery,
    GetCollectiveCurrencyQueryVariables
>;
export const CreateOpenCollectiveProjectDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "CreateOpenCollectiveProject" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "project" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "ProjectCreateInput" },
                        },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "parent" },
                    },
                    type: {
                        kind: "NamedType",
                        name: { kind: "Name", value: "AccountReferenceInput" },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "disableContributions" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Boolean" },
                        },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "disableExpenses" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Boolean" },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "createProject" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "project" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "project" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "parent" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "parent" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: {
                                    kind: "Name",
                                    value: "disableContributions",
                                },
                                value: {
                                    kind: "Variable",
                                    name: {
                                        kind: "Name",
                                        value: "disableContributions",
                                    },
                                },
                            },
                            {
                                kind: "Argument",
                                name: {
                                    kind: "Name",
                                    value: "disableExpenses",
                                },
                                value: {
                                    kind: "Variable",
                                    name: {
                                        kind: "Name",
                                        value: "disableExpenses",
                                    },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "slug" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "name" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "parent" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "slug",
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    CreateOpenCollectiveProjectMutation,
    CreateOpenCollectiveProjectMutationVariables
>;
export const DeleteOpenCollectiveProjectDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "DeleteOpenCollectiveProject" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "account" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: {
                                kind: "Name",
                                value: "AccountReferenceInput",
                            },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "deleteAccount" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "account" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "account" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "id" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "slug" },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    DeleteOpenCollectiveProjectMutation,
    DeleteOpenCollectiveProjectMutationVariables
>;
