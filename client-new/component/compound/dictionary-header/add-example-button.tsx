/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {fakQuotesCirclePlus} from "/client-new/component/atom/icon";
import {EditExampleDialog} from "/client-new/component/compound/edit-example-dialog";
import {create} from "/client-new/component/create";
import {EnhancedDictionary} from "/client-new/skeleton";


export const AddExampleButton = create(
  null, "AddExampleButton",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionaryHeader");

    return (
      <EditExampleDialog dictionary={dictionary} example={null} trigger={(
        <Button variant="light" {...rest}>
          <ButtonIconbag><GeneralIcon icon={fakQuotesCirclePlus}/></ButtonIconbag>
          {trans("button.addExample")}
        </Button>
      )}/>
    );

  }
);