//

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, Ref, useCallback} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {create} from "/client/component/create";
import {EditableExample, EnhancedDictionary} from "/client/skeleton";
import {assignRef} from "/client/util/ref";
import {EditExampleFormBasicSection} from "./edit-example-form-basic-section";
import {EditExampleFormValue, EditExampleInitialData, useEditExample} from "./edit-example-form-hook";
import {EditExampleFormWordSection} from "./edit-example-form-word-section";


export const EditExampleForm = create(
  require("./edit-example-form.scss"), "EditExampleForm",
  function ({
    dictionary,
    initialData,
    formRef,
    onSubmit,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    initialData: EditExampleInitialData | null,
    formRef?: Ref<() => EditExampleFormValue>,
    onSubmit?: (example: EditableExample) => void,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editExampleForm");

    const {form, handleSubmit} = useEditExample(dictionary, initialData, onSubmit);

    const getFormValue = useCallback(function (): EditExampleFormValue {
      return form.getValues();
    }, [form]);

    assignRef(formRef, getFormValue);

    return (
      <form styleName="root" {...rest}>
        <div styleName="main">
          <EditExampleFormBasicSection dictionary={dictionary} form={form}/>
          <EditExampleFormWordSection dictionary={dictionary} form={form}/>
        </div>
        <div styleName="button">
          <Button type="submit" onClick={handleSubmit}>
            <ButtonIconbag><GeneralIcon icon={faCheck}/></ButtonIconbag>
            {trans("button.confirm")}
          </Button>
        </div>
      </form>
    );

  }
);