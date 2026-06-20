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

export type GetProjectBalanceByProjectIdQueryVariables = Exact<{
    slug?: string | null | undefined;
}>;

export type GetProjectBalanceByProjectIdQuery = {
    project: {
        stats: {
            id: string | null;
            balance: { value: number | null; currency: Currency | null };
        } | null;
    } | null;
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
                                                                value: "value",
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
