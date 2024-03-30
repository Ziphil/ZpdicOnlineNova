/* eslint-disable react/jsx-closing-bracket-location */
//

import {ReactElement} from "react";
import {
  AdditionalProps,
  ControlContainer,
  ControlLabel,
  Textarea,
  useTrans
} from "zographia";
import {create} from "/client/component/create";
import {EnhancedDictionary} from "/client/skeleton";
import {EditExampleSpec} from "./edit-example-form-hook";


export const EditExampleFormBasicSection = create(
  require("./edit-example-form-basic-section.scss"), "EditExampleFormBasicSection",
  function ({
    dictionary,
    form,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    form: EditExampleSpec["form"],
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editExampleForm");

    const {register} = form;
    const translationEditable = !form.watch("offer");

    return (
      <section styleName="root" {...rest}>
        <h3 styleName="heading">{trans("heading.basic")}</h3>
        <div styleName="control">
          <ControlContainer>
            <ControlLabel>{trans("label.sentence")}</ControlLabel>
            <Textarea styleName="textarea" {...register("sentence")}/>
          </ControlContainer>
          <ControlContainer>
            <ControlLabel>{trans("label.translation")}</ControlLabel>
            <Textarea styleName="textarea" disabled={!translationEditable} {...register("translation")}/>
          </ControlContainer>
        </div>
      </section>
    );

  }
);