//

import "/client/declaration";


export const DOCUMENTS = {
  ja: [
    {path: "zatlin", fetchSource: () => import("./ja/zatlin.md")}
  ]
} as Documents;

type Document = {path: string, fetchSource: () => Promise<typeof import("*.md")>};
type Documents = {[locale: string]: Array<Document>};