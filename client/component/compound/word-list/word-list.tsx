/* eslint-disable react/jsx-closing-bracket-location */

import {faCommentQuestion, faPlus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, List, ListBody, ListEmptyView, ListLoadingView, ListPagination, PageSpec, useTrans} from "zographia";
import {AddProposalDialog} from "/client/component/compound/add-proposal-dialog";
import {EditWordDialog} from "/client/component/compound/edit-word-dialog";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, OldWord, TemplateWord, Word, WordWithExamples} from "/client/skeleton";
import {TemplateWordCard} from "./template-word-card";
import {WordCard} from "./word-card";


export const WordList = create(
  require("./word-list.scss"), "WordList",
  function ({
    dictionary,
    words,
    pageSpec,
    emptyType,
    showHeader = false,
    showSelectButton = false,
    template = false,
    onSelect,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    words?: Array<Word | OldWord | TemplateWord | WordWithExamples>,
    pageSpec: PageSpec,
    emptyType: "create" | "proposal" | "history" | "none",
    showHeader?: boolean,
    showSelectButton?: boolean,
    template?: boolean,
    onSelect?: (word: Word) => void,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("wordList");

    return (
      <List styleName="root" items={words} pageSpec={pageSpec} {...rest}>
        <ListBody styleName="body">
          {(word) => (template) ? (
            <TemplateWordCard key={word.id} dictionary={dictionary} word={word}/>
          ) : (
            <WordCard key={word.id} dictionary={dictionary} word={word} showHeader={showHeader} showSelectButton={showSelectButton} onSelect={onSelect}/>
          )}
          <ListLoadingView/>
          {(emptyType !== "none") ? (
            <ListEmptyView styleName="empty">
              <span>
                {trans("empty")}
              </span>
              {(emptyType === "create") ? (
                <EditWordDialog dictionary={dictionary} initialData={null} trigger={(
                  <Button scheme="gray" variant="light">
                    <ButtonIconbag><GeneralIcon icon={faPlus}/></ButtonIconbag>
                    {trans("button.create")}
                  </Button>
                )}/>
              ) : (emptyType === "proposal") ? (
                <AddProposalDialog dictionary={dictionary} trigger={(
                  <Button scheme="gray" variant="light">
                    <ButtonIconbag><GeneralIcon icon={faCommentQuestion}/></ButtonIconbag>
                    {trans("button.proposal")}
                  </Button>
                )}/>
              ) : null}
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