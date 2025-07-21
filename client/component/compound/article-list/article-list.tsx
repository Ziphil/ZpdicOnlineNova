//

import {ReactElement} from "react";
import {AdditionalProps, List, ListBody, ListEmptyView, ListLoadingView, ListPagination, PageSpec, useTrans} from "zographia";
import {create} from "/client/component/create";
import {Article, DictionaryWithExecutors} from "/server/internal/skeleton";
import {ArticleCard} from "./article-card";


export const ArticleList = create(
  require("./article-list.scss"), "ArticleList",
  function ({
    dictionary,
    articles,
    pageSpec,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    articles: Array<Article>,
    pageSpec: PageSpec,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("articleList");

    return (
      <List styleName="root" items={articles} pageSpec={pageSpec} {...rest}>
        <ListBody styleName="body">
          {(article) => <ArticleCard key={article.id} dictionary={dictionary} article={article}/>}
          <ListLoadingView styleName="loading"/>
          <ListEmptyView styleName="loading">
            {trans("empty")}
          </ListEmptyView>
        </ListBody>
        <ListPagination styleName="pagination"/>
      </List>
    );

  }
);