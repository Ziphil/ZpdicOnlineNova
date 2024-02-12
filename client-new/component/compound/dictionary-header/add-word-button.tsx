//

import {ReactElement, useCallback} from "react";
import {useHref} from "react-router";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {fakNoteCirclePlus} from "/client-new/component/atom/icon";
import {create} from "/client-new/component/create";
import {DetailedDictionary} from "/client-new/skeleton";


export const AddWordButton = create(
  null, "AddWordButton",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: DetailedDictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionaryHeader");

    const addWordPageUrl = useHref(`/dictionary/${dictionary.number}/word/new`);

    const addWord = useCallback(function (): void {
      window.open(addWordPageUrl);
    }, [addWordPageUrl]);

    return (
      <Button variant="light" onClick={addWord} {...rest}>
        <ButtonIconbag><GeneralIcon icon={fakNoteCirclePlus}/></ButtonIconbag>
        {trans("button.addWord")}
      </Button>
    );

  }
);