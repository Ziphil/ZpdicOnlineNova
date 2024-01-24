//

import {faUserPlus} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  GeneralIcon,
  useTrans
} from "zographia";
import {create} from "/client-new/component/create";
import {EnhancedDictionary} from "/client-new/skeleton";
import {EditWordFormBasicSection} from "./edit-word-form-basic-section";
import {useEditWordForm} from "./edit-word-form-hook";


export const EditWordForm = create(
  require("./edit-word-form.scss"), "EditWordForm",
  function ({
    dictionary,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNode} = useTrans("editWordForm");

    const {form, handleSubmit} = useEditWordForm();
    const {register, getFieldState, formState: {errors}} = form;

    return (
      <form styleName="root" {...rest}>
        <EditWordFormBasicSection dictionary={dictionary} form={form}/>
        <div styleName="button">
          <Button type="submit" onClick={handleSubmit}>
            <ButtonIconbag><GeneralIcon icon={faUserPlus}/></ButtonIconbag>
            {trans("button.confirm")}
          </Button>
        </div>
      </form>
    );

  }
);