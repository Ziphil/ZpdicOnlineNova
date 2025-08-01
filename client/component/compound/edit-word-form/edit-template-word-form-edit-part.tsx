//

import {ReactElement} from "react";
import {AdditionalProps} from "zographia";
import {create} from "/client/component/create";
import {preventDefault} from "/client/util/form";
import {DictionaryWithExecutors} from "/server/internal/skeleton";
import {EditTemplateWordFormBasicSection} from "./edit-template-word-form-basic-section";
import {EditTemplateWordSpec} from "./edit-template-word-form-hook";
import {EditTemplateWordFormRelationSection} from "./edit-template-word-form-relation-section";
import {EditWordFormEquivalentSection} from "./edit-word-form-equivalent-section";
import {EditWordFormInformationSection} from "./edit-word-form-information-section";
import {EditWordFormVariationSection} from "./edit-word-form-variation-section";


export const EditTemplateWordFormEditPart = create(
  require("./edit-word-form-edit-part.scss"), "EditTemplateWordFormEditPart",
  function ({
    dictionary,
    formSpec,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    formSpec: EditTemplateWordSpec,
    className?: string
  } & AdditionalProps): ReactElement {

    const {form} = formSpec;

    return (
      <form styleName="root" onSubmit={preventDefault} {...rest}>
        <div styleName="main">
          <EditTemplateWordFormBasicSection dictionary={dictionary} form={form}/>
          <EditWordFormEquivalentSection dictionary={dictionary} form={form as any}/>
          <EditWordFormInformationSection dictionary={dictionary} form={form as any}/>
          <EditWordFormVariationSection dictionary={dictionary} form={form as any}/>
          <EditTemplateWordFormRelationSection dictionary={dictionary} form={form}/>
        </div>
      </form>
    );

  }
);