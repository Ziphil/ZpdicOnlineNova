/* eslint-disable react/jsx-closing-bracket-location */

import {faListCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {AddCommissionDialog} from "/client-new/component/compound/add-commission-dialog";
import {create} from "/client-new/component/create";
import {EnhancedDictionary} from "/client-new/skeleton";


export const AddCommissionButton = create(
  null, "AddCommissionButton",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionaryHeader");

    return (
      <AddCommissionDialog dictionary={dictionary} trigger={(
        <Button scheme="secondary" variant="underline" {...rest}>
          <ButtonIconbag><GeneralIcon icon={faListCheck}/></ButtonIconbag>
          {trans("button.addCommission")}
        </Button>
      )}/>
    );

  }
);