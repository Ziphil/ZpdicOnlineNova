/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {create} from "/client/component/create";
import {UserWithDetail} from "/server/internal/skeleton";
import {SOCIAL_ROW_COUNT, useChangeMySocials} from "./change-my-socials-form-hook";
import {ChangeMySocialsFormRow} from "./change-my-socials-form-row";


export const ChangeMySocialsForm = create(
  require("./change-my-socials-form.scss"), "ChangeMySocialsForm",
  function ({
    me,
    ...rest
  }: {
    me: UserWithDetail,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("changeMySocialsForm");

    const {form, handleSubmit} = useChangeMySocials(me);

    return (
      <form styleName="root" {...rest}>
        <div styleName="table">
          {Array.from({length: SOCIAL_ROW_COUNT}, (dummy, index) => (
            <ChangeMySocialsFormRow key={index} form={form} index={index}/>
          ))}
        </div>
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
