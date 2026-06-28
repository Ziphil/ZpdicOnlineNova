//

import {faKey} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {create} from "/client/component/create";


export const GenerateMyApiCredentialForm = create(
  require("./generate-my-api-credential-form.scss"), "GenerateMyApiCredentialForm",
  function ({
    onSubmit,
    ...rest
  }: {
    onSubmit: () => void,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("generateMyApiCredentialForm");

    return (
      <form styleName="root" {...rest}>
        <div>
          <Button variant="light" type="submit" onClick={onSubmit}>
            <ButtonIconbag><GeneralIcon icon={faKey}/></ButtonIconbag>
            {trans("button.generate")}
          </Button>
        </div>
      </form>
    );

  }
);
