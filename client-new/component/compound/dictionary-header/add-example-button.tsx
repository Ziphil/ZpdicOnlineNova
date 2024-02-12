//

import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {fakQuotesCirclePlus} from "/client-new/component/atom/icon";
import {create} from "/client-new/component/create";
import {DetailedDictionary} from "/client-new/skeleton";


export const AddExampleButton = create(
  null, "AddExampleButton",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: DetailedDictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionaryHeader");

    return (
      <Button variant="light" {...rest}>
        <ButtonIconbag><GeneralIcon icon={fakQuotesCirclePlus}/></ButtonIconbag>
        {trans("button.addExample")}
      </Button>
    );

  }
);