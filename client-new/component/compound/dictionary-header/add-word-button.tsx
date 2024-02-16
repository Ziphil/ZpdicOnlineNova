/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {fakNoteCirclePlus} from "/client-new/component/atom/icon";
import {EditWordDialog} from "/client-new/component/compound/edit-word-dialog";
import {create} from "/client-new/component/create";
import {EnhancedDictionary} from "/client-new/skeleton";


export const AddWordButton = create(
  null, "AddWordButton",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionaryHeader");

    return (
      <EditWordDialog dictionary={dictionary} word={null} trigger={(
        <Button variant="light" {...rest}>
          <ButtonIconbag><GeneralIcon icon={fakNoteCirclePlus}/></ButtonIconbag>
          {trans("button.addWord")}
        </Button>
      )}/>
    );

  }
);