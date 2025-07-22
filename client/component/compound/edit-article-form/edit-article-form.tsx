//

import {ReactElement, useState} from "react";
import {AdditionalProps, data} from "zographia";
import {create} from "/client/component/create";
import {Dictionary} from "/server/internal/skeleton";
import {EditArticleFormEditPart} from "./edit-article-form-edit-part";
import {EditArticleInitialData, EditArticleSpec} from "./edit-article-form-hook";


export const EditArticleForm = create(
  require("./edit-article-form.scss"), "EditArticleForm",
  function ({
    dictionary,
    initialData,
    formSpec,
    ...rest
  }: {
    dictionary: Dictionary,
    initialData: EditArticleInitialData | null,
    formSpec: EditArticleSpec,
    className?: string
  } & AdditionalProps): ReactElement {

    const [tabValue, setTabValue] = useState<"edit">("edit");

    return (
      <div styleName="root" {...rest}>
        <div styleName="part" {...data({shown: tabValue === "edit"})}>
          <EditArticleFormEditPart dictionary={dictionary} formSpec={formSpec}/>
        </div>
      </div>
    );

  }
);