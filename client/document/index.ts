//

import "/client/declaration";


export const DOCUMENTS = {
  ja: [
    {path: "", fetchSource: () => import("./ja/index.md")},
    {path: "zatlin/introduction", type: "tester", fetchSource: () => import("./ja/zatlin/introduction.md")},
    {path: "zatlin/syntax", type: "tester", fetchSource: () => import("./ja/zatlin/syntax.md")}
  ],
  en: [
    {path: "", fetchSource: () => import("./en/index.md")}
  ]
} as Documents;

type Document = {path: string, type?: string, fetchSource: () => Promise<typeof import("*.md")>};
type Documents = {[locale: string]: Array<Document>};