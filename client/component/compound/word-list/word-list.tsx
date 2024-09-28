/* eslint-disable react/jsx-closing-bracket-location */

import {faCommentQuestion, faPlus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, List, ListBody, ListEmptyView, ListLoadingView, ListPagination, PageSpec, useTrans} from "zographia";
import {AddCommissionDialog} from "/client/component/compound/add-commission-dialog";
import {EditWordDialog} from "/client/component/compound/edit-word-dialog";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, Word, WordWithExamples} from "/client/skeleton";
import {WordCard} from "./word-card";


export const WordList = create(
  require("./word-list.scss"), "WordList",
  function ({
    dictionary,
    words,
    pageSpec,
    canEdit,
    showEmpty = true,
    showHeader = false,
    onSelect,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    words?: Array<Word | WordWithExamples>,
    pageSpec: PageSpec,
    canEdit: boolean,
    showEmpty?: boolean,
    showHeader?: boolean,
    onSelect?: (offer: Word) => void,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("wordList");

    return (
      <List styleName="root" items={words} pageSpec={pageSpec} {...rest}>
        <ListBody styleName="body">
          {(word) => <WordCard key={word.id} dictionary={dictionary} word={word} showHeader={showHeader}/>}
          <ListLoadingView/>
          {(showEmpty) ? (
            <ListEmptyView styleName="empty">
              <span>{trans("empty")}</span>
              {(canEdit) ? (
                <EditWordDialog dictionary={dictionary} initialData={null} trigger={(
                  <Button scheme="gray" variant="light">
                    <ButtonIconbag><GeneralIcon icon={faPlus}/></ButtonIconbag>
                    {trans("button.create")}
                  </Button>
                )}/>
              ) : (
                <AddCommissionDialog dictionary={dictionary} trigger={(
                  <Button scheme="gray" variant="light">
                    <ButtonIconbag><GeneralIcon icon={faCommentQuestion}/></ButtonIconbag>
                    {trans("button.commission")}
                  </Button>
                )}/>
              )}
            </ListEmptyView>
          ) : (
            <div/>
          )}
        </ListBody>
        <ListPagination styleName="pagination"/>
      </List>
    );

  }
);