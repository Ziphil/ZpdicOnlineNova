//

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, GeneralIcon, useTrans} from "zographia";
import {EditWordFormRelationSection} from "/client/component/compound/edit-word-form/edit-word-form-relation-section";
import {create} from "/client/component/create";
import {EditableWord, EnhancedDictionary, Word} from "/client/skeleton";
import {EditWordFormBasicSection} from "./edit-word-form-basic-section";
import {EditWordFormEquivalentSection} from "./edit-word-form-equivalent-section";
import {useEditWord} from "./edit-word-form-hook";
import {EditWordFormInformationSection} from "./edit-word-form-information-section";
import {EditWordFormVariationSection} from "./edit-word-form-variation-section";


export const EditWordForm = create(
  require("./edit-word-form.scss"), "EditWordForm",
  function ({
    dictionary,
    word,
    onSubmit,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    word: Word | EditableWord | null,
    onSubmit?: (word: EditableWord) => void,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    const {form, handleSubmit} = useEditWord(dictionary, word, onSubmit);

    return (
      <form styleName="root" {...rest}>
        <div styleName="main">
          <EditWordFormBasicSection dictionary={dictionary} form={form} word={word}/>
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