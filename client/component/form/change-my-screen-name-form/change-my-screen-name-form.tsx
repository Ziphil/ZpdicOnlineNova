/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, ControlContainer, GeneralIcon, Input, useTrans} from "zographia";
import {ControlErrorMessage} from "/client/component/atom/control-container";
import {create} from "/client/component/create";
import {DetailedUser} from "/client/skeleton";
import {useChangeMyScreenName} from "./change-my-screen-name-form-hook";


export const ChangeMyScreenNameForm = create(
  require("../common.scss"), "ChangeMyScreenNameForm",
  function ({
    me,
    ...rest
  }: {
    me: DetailedUser,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("changeMyScreenNameForm");

    const {form, handleSubmit} = useChangeMyScreenName(me);
    const {register, getFieldState, formState: {errors}} = form;

    return (
      <form styleName="root" {...rest}>
        <ControlContainer>
          <Input error={!!getFieldState("screenName").error} {...register("screenName")}/>
          <ControlErrorMessage name="screenName" form={form} trans={trans}/>
        </ControlContainer>
        <div>
          <Button variant="light" type="submit" onClick={handleSubmit}>
            <ButtonIconbag><GeneralIcon icon={faCheck}/></ButtonIconbag>
            {trans(":commonForm.button.change")}
          </Button>
        </div>
      </form>
    );

  }
);