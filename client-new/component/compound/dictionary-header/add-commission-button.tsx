//

import {faListCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {DetailedDictionary} from "/client-new/skeleton";


export const AddCommissionButton = create(
  null, "AddCommissionButton",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: DetailedDictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionaryHeader");

    return (
      <Button scheme="secondary" variant="underline" {...rest}>
        <ButtonIconbag><GeneralIcon icon={faListCheck}/></ButtonIconbag>
        {trans("button.addCommission")}
      </Button>
    );

  }
);