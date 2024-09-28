//

import {ReactElement, useCallback, useState} from "react";
import {AdditionalProps} from "zographia";
import {WordList} from "/client/component/compound/word-list";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {DictionaryWithExecutors, Word} from "/client/skeleton";
import {calcOffsetSpec} from "/client/util/misc";
import {EditWordSpec} from "./edit-word-form-hook";


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

    const {form, handleSubmit} = formSpec;

    const wordNumber = form.watch("number");
    const [page, setPage] = useState(0);
    const [[offers, hitSize] = []] = useResponse("fetchOldWords", (wordNumber !== null) && {number: dictionary.number, wordNumber, ...calcOffsetSpec(page, 50)}, {keepPreviousData: true});

    const handleSelect = useCallback(function (word: Word): void {
      setTabValue("edit");
    }, [setTabValue]);

    return (
      <div styleName="root" {...rest}>
        <WordList dictionary={dictionary} words={offers} pageSpec={{size: 50, hitSize, page, onPageSet: setPage}} canEdit={false} showHeader={true} onSelect={handleSelect}/>
      </div>

    );

  }
);