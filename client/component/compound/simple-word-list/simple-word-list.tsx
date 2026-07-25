//

import {ReactElement} from "react";
import {AdditionalProps, List, ListBody, ListEmptyView, ListLoadingView, ListPagination, PageSpec, useTrans} from "zographia";
import {create} from "/client/component/create";
import {WordWithDictionary} from "/server/internal/skeleton";
import {SimpleWordCard} from "./simple-word-card";


export const SimpleWordList = create(
  require("./simple-word-list.scss"), "SimpleWordList",
  function ({
    words,
    pageSpec,
    ...rest
  }: {
    words?: Array<WordWithDictionary>,
    pageSpec: PageSpec,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("simpleWordList");

    return (
      <List styleName="root" items={words} pageSpec={pageSpec} {...rest}>
        <ListBody styleName="body">
          {(word) => (
            <SimpleWordCard key={word.id} word={word}/>
          )}
          <ListLoadingView/>
          <ListEmptyView styleName="empty">
            <span>
              {trans("empty")}
            </span>
          </ListEmptyView>
        </ListBody>
        <ListPagination styleName="pagination"/>
      </List>
    );

  }
);
