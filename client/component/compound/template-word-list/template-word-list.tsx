/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement} from "react";
import {AdditionalProps, List, ListBody, ListEmptyView, ListLoadingView, ListPagination, PageSpec, useTrans} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, TemplateWord} from "/server/internal/skeleton";
import {TemplateWordCard} from "./template-word-card";


export const TemplateWordList = create(
  require("./template-word-list.scss"), "TemplateWordList",
  function ({
    dictionary,
    words,
    pageSpec,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    words?: Array<TemplateWord>,
    pageSpec: PageSpec,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("templateWordList");

    return (
      <List styleName="root" items={words} pageSpec={pageSpec} {...rest}>
        <ListBody styleName="body">
          {(word) => <TemplateWordCard key={word.id} dictionary={dictionary} word={word}/>}
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