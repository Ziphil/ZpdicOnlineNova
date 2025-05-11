/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, CheckableContainer, CheckableLabel, ControlContainer, GeneralIcon, Radio, useTrans} from "zographia";
import {create} from "/client/component/create";
import {Dictionary} from "/client/skeleton";
import {useChangeDictionaryVisibility} from "./change-dictionary-visibility-form-hook";


export const ChangeDictionaryVisibilityForm = create(
  require("../common.scss"), "ChangeDictionaryVisibilityForm",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: Dictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("changeDictionaryVisibilityForm");

    const {form, handleSubmit} = useChangeDictionaryVisibility(dictionary);
    const {register} = form;

    return (
      <form styleName="root" {...rest}>
        <ControlContainer>
          <div styleName="radio-group">
            <CheckableContainer>
              <Radio value="public" {...register("visibility")}/>
              <CheckableLabel>{trans("label.public")}</CheckableLabel>
            </CheckableContainer>
            <CheckableContainer>
              <Radio value="unlisted" {...register("visibility")}/>
              <CheckableLabel>{trans("label.unlisted")}</CheckableLabel>
            </CheckableContainer>
            <CheckableContainer>
              <Radio value="private" {...register("visibility")}/>
              <CheckableLabel>{trans("label.private")}</CheckableLabel>
            </CheckableContainer>
          </div>
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