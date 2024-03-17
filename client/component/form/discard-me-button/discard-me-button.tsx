//

import {faTrashAlt} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {create} from "/client/component/create";
import {useDiscardMe} from "./discard-me-button-hook";


export const DiscardMeButton = create(
  require("../common.scss"), "DiscardMeButton",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("discardMeButton");

    const handleSubmit = useDiscardMe();

    return (
      <div>
        <Button scheme="red" variant="light" onClick={handleSubmit} {...rest}>
          <ButtonIconbag><GeneralIcon icon={faTrashAlt}/></ButtonIconbag>
          {trans("button.submit")}
        </Button>
      </div>
    );

  }
);