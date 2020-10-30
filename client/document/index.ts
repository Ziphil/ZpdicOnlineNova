//

import "/client/declaration";


export const DOCUMENTS = {
  ja: [
    {path: "", fetchSource: () => import("./ja/index.md")},
    {path: "zatlin", type: "tester", fetchSource: () => import("./ja/zatlin.md")}
  ]
} as Documents;

type Document = {path: string, type?: string, fetchSource: () => Promise<typeof import("*.md")>};
type Documents = {[locale: string]: Array<Document>};