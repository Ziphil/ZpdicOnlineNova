//

import {faClockRotateLeft, faPen} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, Ref, useState} from "react";
import {UseFormReturn} from "react-hook-form";
import {AdditionalProps, GeneralIcon, Tab, TabIconbag, TabList, data, useTrans} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithExecutors} from "/client/skeleton";
import {assignRef} from "/client/util/ref";
import {EditWordFormEditPart} from "./edit-word-form-edit-part";
import {EditWordFormHistoryPart} from "./edit-word-form-history-part";
import {EditWordFormValue, EditWordInitialData, EditWordSpec} from "./edit-word-form-hook";


export const EditWordForm = create(
  require("./edit-word-form.scss"), "EditWordForm",
  function ({
    dictionary,
    initialData,
    formSpec,
    formRef,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    initialData: EditWordInitialData | null,
    formSpec: EditWordSpec,
    formRef?: Ref<UseFormReturn<EditWordFormValue>>,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("editWordForm");

    const {form} = formSpec;
    const editing = form.watch("number") !== null;

    const [tabValue, setTabValue] = useState<"edit" | "history">("edit");

    assignRef(formRef, form);

    return (
      <div styleName="root" {...rest}>
        {(editing) && (
          <TabList styleName="tab-list" value={tabValue} scheme="primary">
            <Tab value="edit" onClick={() => setTabValue("edit")}>
              <TabIconbag><GeneralIcon icon={faPen}/></TabIconbag>
              {trans("tab.edit")}
            </Tab>
            <Tab value="history" onClick={() => setTabValue("history")}>
              <TabIconbag><GeneralIcon icon={faClockRotateLeft}/></TabIconbag>
              {trans("tab.old")}
            </Tab>
          </TabList>
        )}
        <div styleName="part" {...data({shown: tabValue === "edit"})}>
          <EditWordFormEditPart dictionary={dictionary} formSpec={formSpec}/>
        </div>
        {(editing) && (
          <div styleName="part" {...data({shown: tabValue === "history"})}>
            <EditWordFormHistoryPart dictionary={dictionary} formSpec={formSpec} setTabValue={setTabValue}/>
          </div>
        )}
      </div>
    );

  }
);