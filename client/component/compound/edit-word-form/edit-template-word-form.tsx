//

import {ReactElement} from "react";
import {AdditionalProps} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithExecutors} from "/client/skeleton";
import {EditTemplateWordFormEditPart} from "./edit-template-word-form-edit-part";
import {EditTemplateWordInitialData, EditTemplateWordSpec} from "./edit-template-word-form-hook";


export const EditTemplateWordForm = create(
  require("./edit-word-form.scss"), "EditTemplateWordForm",
  function ({
    dictionary,
    initialData,
    formSpec,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    initialData: EditTemplateWordInitialData | null,
    formSpec: EditTemplateWordSpec,
    className?: string
  } & AdditionalProps): ReactElement {

    return (
      <div styleName="root" {...rest}>
        <EditTemplateWordFormEditPart dictionary={dictionary} formSpec={formSpec}/>
      </div>
    );

  }
);