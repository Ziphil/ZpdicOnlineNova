/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, ControlContainer, GeneralIcon, Input, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {DetailedUser} from "/client-new/skeleton";
import {useChangeMyEmail} from "./change-my-email-form-hook";


export const ChangeMyEmailForm = create(
  require("../common.scss"), "ChangeMyEmailForm",
  function ({
    me,
    ...rest
  }: {
    me: DetailedUser,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("changeMyEmailForm");

    const {form, handleSubmit} = useChangeMyEmail(me);
    const {register} = form;

    return (
      <form styleName="root" {...rest}>
        <ControlContainer>
          <Input type="email" autoComplete="email" {...register("email")}/>
        </ControlContainer>
        <div>
          <Button onClick={handleSubmit} variant="light">
            <ButtonIconbag><GeneralIcon icon={faCheck}/></ButtonIconbag>
            {trans(":commonForm.button.change")}
          </Button>
        </div>
      </form>
    );

  }
);