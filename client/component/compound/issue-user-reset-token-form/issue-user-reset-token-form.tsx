//

import {faEnvelope} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  ControlContainer,
  ControlLabel,
  GeneralIcon,
  Input,
  useTrans
} from "zographia";
import {ControlErrorMessage} from "/client/component/atom/control-container";
import {create} from "/client/component/create";
import {useIssueUserResetToken} from "./issue-user-reset-token-form-hook";


export const IssueUserResetTokenForm = create(
  require("./issue-user-reset-token-form.scss"), "IssueUserResetTokenForm",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("issueUserResetTokenForm");

    const {form, handleSubmit} = useIssueUserResetToken();
    const {register, getFieldState, formState: {errors}} = form;

    return (
      <form styleName="root" {...rest}>
        <div styleName="control">
          <ControlContainer>
            <ControlLabel>{trans("label.name")}</ControlLabel>
            <Input
              error={getFieldState("name").error !== undefined}
              autoFocus={true}
              autoComplete="username"
              required={true}
              {...register("name")}
            />
            <ControlErrorMessage name="name" form={form} trans={trans}/>
          </ControlContainer>
          <ControlContainer>
            <ControlLabel>{trans("label.email")}</ControlLabel>
            <Input
              error={getFieldState("email").error !== undefined}
              type="email"
              autoComplete="email"
              required={true}
              {...register("email")}
            />
            <ControlErrorMessage name="email" form={form} trans={trans}/>
          </ControlContainer>
        </div>
        <div styleName="button">
          <Button type="submit" onClick={handleSubmit}>
            <ButtonIconbag><GeneralIcon icon={faEnvelope}/></ButtonIconbag>
            {trans("button.confirm")}
          </Button>
        </div>
      </form>
    );

  }
);