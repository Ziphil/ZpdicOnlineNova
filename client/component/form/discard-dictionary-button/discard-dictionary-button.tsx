//

import {faTrashAlt} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithUser} from "/server/internal/skeleton";
import {useDiscardDictionary} from "./discard-dictionary-button-hook";


export const DiscardDictionaryButton = create(
  require("../common.scss"), "DiscardDictionaryButton",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: DictionaryWithUser,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("discardDictionaryButton");

    const handleSubmit = useDiscardDictionary(dictionary);

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