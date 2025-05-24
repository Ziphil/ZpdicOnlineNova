//

import {ReactElement, Ref, useCallback, useState} from "react";
import {AdditionalProps, data, useTrans} from "zographia";
import {create} from "/client/component/create";
import {Dictionary} from "/client/skeleton";
import {assignRef} from "/client/util/ref";
import {EditArticleFormEditPart} from "./edit-article-form-edit-part";
import {EditArticleFormValue, EditArticleInitialData, EditArticleSpec} from "./edit-article-form-hook";


export const EditArticleForm = create(
  require("./edit-article-form.scss"), "EditArticleForm",
  function ({
    dictionary,
    initialData,
    formSpec,
    formRef,
    ...rest
  }: {
    dictionary: Dictionary,
    initialData: EditArticleInitialData | null,
    formSpec: EditArticleSpec,
    formRef?: Ref<() => EditArticleFormValue>,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editArticleForm");

    const {form} = formSpec;

    const [tabValue, setTabValue] = useState<"edit">("edit");

    const getFormValue = useCallback(function (): EditArticleFormValue {
      return form.getValues();
    }, [form]);

    assignRef(formRef, getFormValue);

    return (
      <div styleName="root" {...rest}>
        <div styleName="part" {...data({shown: tabValue === "edit"})}>
          <EditArticleFormEditPart dictionary={dictionary} formSpec={formSpec}/>
        </div>
      </div>
    );

  }
);