//

import {ReactElement} from "react";
import {AdditionalProps} from "zographia";
import {EditWordFormRelationSection} from "/client/component/compound/edit-word-form/edit-word-form-relation-section";
import {create} from "/client/component/create";
import {preventDefault} from "/client/util/form";
import {DictionaryWithExecutors} from "/server/internal/skeleton";
import {EditWordFormBasicSection} from "./edit-word-form-basic-section";
import {EditWordFormEquivalentSection} from "./edit-word-form-equivalent-section";
import {EditWordSpec} from "./edit-word-form-hook";
import {EditWordFormInformationSection} from "./edit-word-form-information-section";
import {EditWordFormPhraseSection} from "./edit-word-form-phrase-section";
import {EditWordFormVariationSection} from "./edit-word-form-variation-section";


export const EditWordFormEditPart = create(
  require("./edit-word-form-edit-part.scss"), "EditWordFormEditPart",
  function ({
    dictionary,
    formSpec,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    formSpec: EditWordSpec,
    className?: string
  } & AdditionalProps): ReactElement {

    const {form} = formSpec;

    return (
      <form styleName="root" onSubmit={preventDefault} {...rest}>
        <div styleName="main">
          <EditWordFormBasicSection dictionary={dictionary} form={form}/>
          <EditWordFormEquivalentSection dictionary={dictionary} form={form as any}/>
          <EditWordFormInformationSection dictionary={dictionary} form={form as any}/>
          <EditWordFormPhraseSection dictionary={dictionary} form={form as any}/>
          <EditWordFormVariationSection dictionary={dictionary} form={form as any}/>
          <EditWordFormRelationSection dictionary={dictionary} form={form}/>
        </div>
      </form>
    );

  }
);