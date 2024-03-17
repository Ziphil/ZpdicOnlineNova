//

import {faEnvelope} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  CheckableContainer,
  CheckableLabel,
  Checkbox,
  ControlContainer,
  ControlLabel,
  GeneralIcon,
  Input,
  Textarea,
  useTrans
} from "zographia";
import {ControlErrorMessage} from "/client/component/atom/control-container";
import {Link} from "/client/component/atom/link";
import {create} from "/client/component/create";
import {useMe} from "/client/hook/auth";
import {useContact} from "./contact-form-hook";


export const ContactForm = create(
  require("./contact-form.scss"), "ContactForm",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNode} = useTrans("contactForm");

    const me = useMe();

    const {form, handleSubmit} = useContact(me);
    const {register, getFieldState, formState: {errors}} = form;

    return (
      <form styleName="root" {...rest}>
        <div styleName="control">
          <ControlContainer>
            <ControlLabel>{trans("label.name")}</ControlLabel>
            <Input
              error={getFieldState("name").error !== undefined}
              disabled={me !== null}
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
              disabled={me !== null}
              autoComplete="email"
              required={true}
              {...register("email")}
            />
            <ControlErrorMessage name="email" form={form} trans={trans}/>
          </ControlContainer>
          <ControlContainer>
            <ControlLabel>{trans("label.subject")}</ControlLabel>
            <Input
              error={getFieldState("subject").error !== undefined}
              required={true}
              {...register("subject")}
            />
            <ControlErrorMessage name="subject" form={form} trans={trans}/>
          </ControlContainer>
          <ControlContainer>
            <ControlLabel>{trans("label.text")}</ControlLabel>
            <Textarea
              styleName="textarea"
              error={getFieldState("text").error !== undefined}
              required={true}
              {...register("text")}
            />
            <ControlErrorMessage name="text" form={form} trans={trans}/>
          </ControlContainer>
          <ControlContainer>
            <CheckableContainer>
              <Checkbox
                error={getFieldState("agree").error !== undefined}
                required={true}
                {...register("agree")}
              />
              <CheckableLabel>
                {transNode("label.agree", {
                  link: (parts) => <Link href="/document/other/privacy" scheme="secondary" variant="underline" target="_blank">{parts}</Link>
                })}
              </CheckableLabel>
            </CheckableContainer>
            <ControlErrorMessage name="agree" form={form} trans={trans}/>
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