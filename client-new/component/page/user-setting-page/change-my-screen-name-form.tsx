/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, ControlContainer, GeneralIcon, Input, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {DetailedUser} from "/client-new/skeleton";
import {useChangeMyScreenName} from "./change-my-screen-name-form-hook";


export const ChangeMyScreenNameForm = create(
  require("./change-my-email-form.scss"), "ChangeMyScreenNameForm",
  function ({
    me,
    ...rest
  }: {
    me: DetailedUser,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("userSettingPage");

    const {form, handleSubmit} = useChangeMyScreenName(me);
    const {register} = form;

    return (
      <form styleName="root" {...rest}>
        <ControlContainer>
          <Input {...register("screenName")}/>
        </ControlContainer>
        <div>
          <Button onClick={handleSubmit} variant="light">
            <ButtonIconbag><GeneralIcon icon={faCheck}/></ButtonIconbag>
            {trans("button.change")}
          </Button>
        </div>
      </form>
    );

  }
);