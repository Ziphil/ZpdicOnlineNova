//

import {faBooks, faPen} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, Ref, useState} from "react";
import {UseFormReturn} from "react-hook-form";
import {AdditionalProps, GeneralIcon, Tab, TabIconbag, TabList, data, useTrans} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, EditableExample} from "/client/skeleton";
import {assignRef} from "/client/util/ref";
import {EditExampleFormEditPart} from "./edit-example-form-edit-part";
import {EditExampleFormValue, EditExampleInitialData, useEditExample} from "./edit-example-form-hook";
import {EditExampleFormOfferPart} from "./edit-example-form-offer-part";


export const EditExampleForm = create(
  require("./edit-example-form.scss"), "EditExampleForm",
  function ({
    dictionary,
    initialData,
    formRef,
    onSubmit,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    initialData: EditExampleInitialData | null,
    formRef?: Ref<UseFormReturn<EditExampleFormValue>>,
    onSubmit?: (example: EditableExample) => void,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editExampleForm");

    const formSpec = useEditExample(dictionary, initialData, onSubmit);
    const {form} = formSpec;

    const [tabValue, setTabValue] = useState<"edit" | "offer">("edit");

    assignRef(formRef, form);

    return (
      <div styleName="root" {...rest}>
        <TabList styleName="tab-list" value={tabValue} scheme="primary">
          <Tab value="edit" onClick={() => setTabValue("edit")}>
            <TabIconbag><GeneralIcon icon={faPen}/></TabIconbag>
            {trans("tab.edit")}
          </Tab>
          <Tab value="offer" onClick={() => setTabValue("offer")}>
            <TabIconbag><GeneralIcon icon={faBooks}/></TabIconbag>
            {trans("tab.offer")}
          </Tab>
        </TabList>
        <div styleName="part" {...data({shown: tabValue === "edit"})}>
          <EditExampleFormEditPart dictionary={dictionary} formSpec={formSpec}/>
        </div>
        <div styleName="part" {...data({shown: tabValue === "offer"})}>
          <EditExampleFormOfferPart dictionary={dictionary} formSpec={formSpec} setTabValue={setTabValue}/>
        </div>
      </div>
    );

  }
);