//

import type {
  Article as ArticleSkeleton
} from "/client/skeleton";
import {
  Article
} from "/server/model";


export namespace ArticleCreator {

  export function skeletonize(raw: Article): ArticleSkeleton {
    const id = raw.id;
    const number = raw.number;
    const tags = raw.tags;
    const title = raw.title;
    const content = raw.content;
    const createdDate = raw.createdDate.toISOString();
    const updatedDate = raw.updatedDate.toISOString();
    const skeleton = {id, number, tags, title, content, createdDate, updatedDate};
    return skeleton;
  }

}