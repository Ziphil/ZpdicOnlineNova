//

import {faPlay} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, ReactElement, cloneElement, useCallback, useState} from "react";
import {
  Button,
  ButtonIconbag,
  ControlContainer,
  ControlLabel,
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogPane,
  GeneralIcon,
  Input,
  Textarea,
  useTrans
} from "zographia";
import {create} from "/client/component/create";
import {UseFormReturn} from "/client/hook/form";
import {useExecuteZatlin} from "./execute-zatlin-dialog-hook";


export const ExecuteZatlinDialog = create(
  require("./execute-zatlin-dialog.scss"), "ExecuteZatlinDialog",
  function ({
    trigger,
    defaultSource,
    sourceForm,
    ...rest
  }: {
    trigger: ReactElement,
    defaultSource?: string,
    sourceForm?: UseFormReturn<{source?: string}>,
    className?: string
  }): ReactElement {

    const {trans} = useTrans("executeZatlinDialog");

    const {form, handleSubmit} = useExecuteZatlin();
    const {register} = form;

    const [open, setOpen] = useState(false);

    const openDialog = useCallback(function (): void {
      const source = defaultSource ?? sourceForm?.getValues("source") ?? "";
      form.setValue("source", source);
      setOpen(true);
    }, [defaultSource, sourceForm, form]);

    return (
      <Fragment>
        {cloneElement(trigger, {onClick: openDialog})}
        <Dialog open={open} onOpenSet={setOpen} height="full" {...rest}>
          <DialogPane styleName="pane">
            <DialogCloseButton/>
            <DialogBody styleName="body">
              <fieldset styleName="column">
                <ControlContainer>
                  <ControlLabel>{trans("label.source")}</ControlLabel>
                  <Textarea styleName="textarea-source" fontFamily="monospace" {...register("source")}/>
                </ControlContainer>
              </fieldset>
              <div>
                <Button onClick={handleSubmit}>
                  <ButtonIconbag><GeneralIcon icon={faPlay}/></ButtonIconbag>
                  {trans("button.execute")}
                </Button>
              </div>
              <fieldset styleName="column">
                <ControlContainer>
                  <ControlLabel>{trans("label.output")}</ControlLabel>
                  <Input readonly={true} {...register("output")}/>
                </ControlContainer>
                <ControlContainer>
                  <ControlLabel>{trans("label.error")}</ControlLabel>
                  <Textarea styleName="textarea-error" fontFamily="monospace" readonly={true} {...register("error")}/>
                </ControlContainer>
              </fieldset>
            </DialogBody>
          </DialogPane>
        </Dialog>
      </Fragment>
    );

  }
);