//

import type {
  Article as ArticleSkeleton,
  EditableArticle as EditableArticleSkeleton
} from "/server/internal/skeleton";
import {
  Article,
  EditableArticle
} from "/server/model";


export namespace ArticleCreator {

  export function skeletonize(raw: Article): ArticleSkeleton {
    const skeleton = {
      id: raw.id,
      number: raw.number,
      tags: raw.tags,
      title: raw.title,
      content: raw.content,
      createdDate: raw.createdDate.toISOString(),
      updatedDate: raw.updatedDate.toISOString()
    } satisfies ArticleSkeleton;
    return skeleton;
  }

  export function enflesh(input: EditableArticleSkeleton): EditableArticle {
    const raw = {
      ...input
    } satisfies EditableArticle;
    return raw;
  }

}