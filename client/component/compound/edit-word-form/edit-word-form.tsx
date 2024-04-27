//

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, Ref, useCallback} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {EditWordFormRelationSection} from "/client/component/compound/edit-word-form/edit-word-form-relation-section";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, EditableWord} from "/client/skeleton";
import {assignRef} from "/client/util/ref";
import {EditWordFormBasicSection} from "./edit-word-form-basic-section";
import {EditWordFormEquivalentSection} from "./edit-word-form-equivalent-section";
import {EditWordFormValue, EditWordInitialData, useEditWord} from "./edit-word-form-hook";
import {EditWordFormInformationSection} from "./edit-word-form-information-section";
import {EditWordFormVariationSection} from "./edit-word-form-variation-section";


export const EditWordForm = create(
  require("./edit-word-form.scss"), "EditWordForm",
  function ({
    dictionary,
    initialData,
    forceAdd = false,
    formRef,
    onSubmit,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    initialData: EditWordInitialData | null,
    forceAdd?: boolean,
    formRef?: Ref<() => EditWordFormValue>,
    onSubmit?: (word: EditableWord) => void,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    const {form, handleSubmit} = useEditWord(dictionary, initialData, forceAdd, onSubmit);

    const getFormValue = useCallback(function (): EditWordFormValue {
      return form.getValues();
    }, [form]);

    assignRef(formRef, getFormValue);

    return (
      <form styleName="root" {...rest}>
        <div styleName="main">
          <EditWordFormBasicSection dictionary={dictionary} form={form}/>
          <EditWordFormEquivalentSection dictionary={dictionary} form={form}/>
          <EditWordFormInformationSection dictionary={dictionary} form={form}/>
          <EditWordFormVariationSection dictionary={dictionary} form={form}/>
          <EditWordFormRelationSection dictionary={dictionary} form={form}/>
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