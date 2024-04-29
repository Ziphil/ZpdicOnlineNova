//

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithExecutors} from "/client/skeleton";
import {preventDefault} from "/client/util/form";
import {EditExampleFormBasicSection} from "./edit-example-form-basic-section";
import {EditExampleSpec} from "./edit-example-form-hook";
import {EditExampleFormWordSection} from "./edit-example-form-word-section";


export const EditExampleFormEditPart = create(
  require("./edit-example-form-edit-part.scss"), "EditExampleFormEditPart",
  function ({
    dictionary,
    formSpec,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    formSpec: EditExampleSpec,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editExampleForm");

    const {form, handleSubmit} = formSpec;

    return (
      <form styleName="root" onSubmit={preventDefault} {...rest}>
        <div styleName="main">
          <EditExampleFormBasicSection dictionary={dictionary} form={form}/>
          <EditExampleFormWordSection dictionary={dictionary} form={form}/>
        </div>
        <div styleName="button">
          <Button onClick={handleSubmit}>
            <ButtonIconbag><GeneralIcon icon={faCheck}/></ButtonIconbag>
            {trans("button.confirm")}
          </Button>
        </div>
      </form>
    );

  }
);