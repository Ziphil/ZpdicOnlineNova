//

import {faArrowUpRightFromSquare} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, MouseEvent, ReactElement, Ref, cloneElement, isValidElement, useCallback, useRef, useState} from "react";
import {useHref} from "react-router-dom";
import rison from "rison";
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogOutsideButton,
  DialogOutsideButtonContainer,
  DialogOutsideButtonIconbag,
  DialogPane,
  GeneralIcon,
  useTrans
} from "zographia";
import {EditWordForm, EditWordFormValue, EditWordInitialData} from "/client/component/compound/edit-word-form";
import {create} from "/client/component/create";
import {DictionaryWithExecutors} from "/client/skeleton";
import {getDictionaryIdentifier} from "/client/util/dictionary";
import {checkOpeningExternal} from "/client/util/form";
import {assignRef, isRef} from "/client/util/ref";


export const EditWordDialog = create(
  require("./edit-word-dialog.scss"), "EditWordDialog",
  function ({
    dictionary,
    initialData,
    trigger,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    initialData: EditWordInitialData | null,
    trigger: ReactElement | Ref<(event: MouseEvent<HTMLButtonElement>) => void>,
    className?: string
  }): ReactElement {

    const {trans} = useTrans("editWordDialog");

    const [open, setOpen] = useState(false);
    const addWordPageUrlBase = useHref(`/dictionary/${getDictionaryIdentifier(dictionary)}/edit/word`);

    const formRef = useRef<() => EditWordFormValue>(null);

    const openDialog = useCallback(function (event: MouseEvent<HTMLButtonElement>): void {
      if (checkOpeningExternal(event)) {
        const number = getWordNumber(initialData);
        const addWordPageUrl = addWordPageUrlBase + `/${(initialData?.forceAdd || number === null) ? "new" : number}?value=${rison.encode(number)}`;
        window.open(addWordPageUrl);
      } else {
        setOpen(true);
      }
    }, [addWordPageUrlBase, initialData]);

    const closeDialog = useCallback(function (): void {
      setOpen(false);
    }, []);

    const openExternal = useCallback(function (): void {
      const value = formRef.current?.();
      if (value !== undefined) {
        const addWordPageUrl = addWordPageUrlBase + `/${(initialData?.forceAdd || value.number === null) ? "new" : value.number}?value=${rison.encode(value)}`;
        window.open(addWordPageUrl);
      }
    }, [addWordPageUrlBase, initialData]);

    if (isRef(trigger)) {
      assignRef(trigger, openDialog);
    }

    return (
      <Fragment>
        {(isValidElement<any>(trigger)) && cloneElement(trigger, {onClick: openDialog})}
        <Dialog open={open} onOpenSet={setOpen} height="full" {...rest}>
          <DialogPane styleName="pane">
            <DialogOutsideButtonContainer>
              <DialogOutsideButton onClick={openExternal}>
                <DialogOutsideButtonIconbag><GeneralIcon icon={faArrowUpRightFromSquare}/></DialogOutsideButtonIconbag>
                {trans("button.external")}
              </DialogOutsideButton>
            </DialogOutsideButtonContainer>
            <DialogCloseButton/>
            <DialogBody>
              <EditWordForm dictionary={dictionary} initialData={initialData} formRef={formRef} onSubmit={closeDialog}/>
            </DialogBody>
          </DialogPane>
        </Dialog>
      </Fragment>
    );

  }
);


function getWordNumber(initialData: EditWordInitialData | null): number | null {
  if (initialData !== null) {
    if (initialData.type === "word") {
      return initialData.word.number;
    } else if (initialData.type === "form") {
      return initialData.value.number;
    } else {
      return initialData.number;
    }
  } else {
    return null;
  }
}