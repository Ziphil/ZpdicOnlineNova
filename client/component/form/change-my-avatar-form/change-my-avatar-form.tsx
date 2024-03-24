/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {Controller} from "react-hook-form";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  ControlContainer,
  FileInput,
  GeneralIcon,
  useTrans
} from "zographia";
import {ControlErrorMessage} from "/client/component/atom/control-container";
import {UserAvatar} from "/client/component/atom/user-avatar";
import {create} from "/client/component/create";
import {DetailedUser} from "/client/skeleton";
import {useChangeMyAvatar} from "./change-my-avatar-form-hook";


export const ChangeMyAvatarForm = create(
  require("./change-my-avatar-form.scss"), "ChangeMyAvatarForm",
  function ({
    me,
    ...rest
  }: {
    me: DetailedUser,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("changeMyAvatarForm");

    const {form, handleSubmit} = useChangeMyAvatar(me);
    const {control, getFieldState, formState: {errors}} = form;

    return (
      <div styleName="root-row">
        <UserAvatar styleName="avatar" user={me}/>
        <form styleName="root" {...rest}>
          <ControlContainer>
            <Controller name="file" control={control} render={({field}) => (
              <FileInput
                value={field.value}
                onSet={field.onChange}
                error={getFieldState("file").error !== undefined}
                multiple={false}
              />
            )}/>
            <ControlErrorMessage name="file" form={form} trans={trans}/>
          </ControlContainer>
          <div>
            <Button variant="light" type="submit" onClick={handleSubmit}>
              <ButtonIconbag><GeneralIcon icon={faCheck}/></ButtonIconbag>
              {trans(":commonForm.button.change")}
            </Button>
          </div>
        </form>
      </div>
    );

  }
);