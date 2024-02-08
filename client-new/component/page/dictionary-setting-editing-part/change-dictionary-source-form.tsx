//

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, ControlContainer, GeneralIcon, Textarea, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {Dictionary} from "/client-new/skeleton";
import {useChangeDictionarySource} from "./change-dictionary-source-form-hook";


export const ChangeDictionarySourceForm = create(
  require("./change-dictionary-source-form.scss"), "ChangeDictionarySourceForm",
  function ({
    dictionary,
    language,
    ...rest
  }: {
    dictionary: Dictionary,
    language: "akrantiain" | "zatlin",
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("dictionarySettingGeneralPart");

    const {form, handleSubmit} = useChangeDictionarySource(dictionary, language);
    const {register} = form;

    return (
      <form styleName="root" {...rest}>
        <ControlContainer>
          <Textarea styleName="textarea" {...register("source")}/>
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