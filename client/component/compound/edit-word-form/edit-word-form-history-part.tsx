//

import {ReactElement, useCallback, useMemo, useState} from "react";
import {AdditionalProps} from "zographia";
import {WordList} from "/client/component/compound/word-list";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {DictionaryWithExecutors, Word} from "/client/skeleton";
import {calcOffsetSpec} from "/client/util/misc";
import {EditWordSpec, getEditWordFormValueFromWord} from "./edit-word-form-hook";


export const EditWordFormHistoryPart = create(
  require("./edit-word-form-history-part.scss"), "EditWordFormHistoryPart",
  function ({
    dictionary,
    formSpec,
    setTabValue,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    formSpec: EditWordSpec,
    setTabValue: (value: "edit" | "history") => void,
    className?: string
  } & AdditionalProps): ReactElement {

    const {form} = formSpec;

    const wordNumber = form.watch("number");

    const [page, setPage] = useState(0);
    const [[words, hitSize] = []] = useResponse("fetchOldWords", (wordNumber !== null) && {number: dictionary.number, wordNumber, ...calcOffsetSpec(page, 50)}, {keepPreviousData: true});
    const oldWords = useMemo(() => words?.map((word, index) => ({...word, precedence: page * 50 + index + 1})), [words, page]);

    const handleSelect = useCallback(function (word: Word): void {
      form.reset(getEditWordFormValueFromWord(word));
      setTabValue("edit");
    }, [form, setTabValue]);

    return (
      <div styleName="root" {...rest}>
        <WordList dictionary={dictionary} words={oldWords} pageSpec={{size: 50, hitSize, page, onPageSet: setPage}} emptyType="history" showHeader={true} showSelectButton={true} onSelect={handleSelect}/>
      </div>
    );

  }
);