//

import {ReactElement, Ref, useCallback, useState} from "react";
import {AdditionalProps, data, useTrans} from "zographia";
import {create} from "/client/component/create";
import {Dictionary, EditableArticle} from "/client/skeleton";
import {assignRef} from "/client/util/ref";
import {EditArticleFormEditPart} from "./edit-article-form-edit-part";
import {EditArticleFormValue, EditArticleInitialData, useEditArticle} from "./edit-article-form-hook";


export const EditArticleForm = create(
  require("./edit-article-form.scss"), "EditArticleForm",
  function ({
    dictionary,
    initialData,
    formRef,
    onSubmit,
    ...rest
  }: {
    dictionary: Dictionary,
    initialData: EditArticleInitialData | null,
    formRef?: Ref<() => EditArticleFormValue>,
    onSubmit?: (example: EditableArticle) => void,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editArticleForm");

    const formSpec = useEditArticle(dictionary, initialData, onSubmit);
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