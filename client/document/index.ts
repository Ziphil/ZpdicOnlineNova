//

import "/client/declaration";


export const DOCUMENTS = {
  ja: [
    {path: "", fetchSource: () => import("./ja/index.md")},
    {path: "akrantiain/overview", type: "tester", fetchSource: () => import("./ja/akrantiain/overview.md")},
    {path: "akrantiain/introduction", type: "tester", fetchSource: () => import("./ja/akrantiain/introduction.md")},
    {path: "zatlin/overview", type: "tester", fetchSource: () => import("./ja/zatlin/overview.md")},
    {path: "zatlin/introduction", type: "tester", fetchSource: () => import("./ja/zatlin/introduction.md")},
    {path: "zatlin/syntax", type: "tester", fetchSource: () => import("./ja/zatlin/syntax.md")}
  ],
  en: [
    {path: "", fetchSource: () => import("./en/index.md")}
  ]
} as Documents;

type Document = {path: string, type?: string, fetchSource: () => Promise<typeof import("*.md")>};
type Documents = {[locale: string]: Array<Document>};