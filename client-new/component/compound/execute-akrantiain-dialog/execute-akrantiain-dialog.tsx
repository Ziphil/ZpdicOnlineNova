//

import {faPlay} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, ReactElement, cloneElement, useCallback, useState} from "react";
import {UseFormReturn} from "react-hook-form";
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
import {create} from "/client-new/component/create";
import {useExecuteAkrantiain} from "./execute-akrantiain-dialog-hook";


export const ExecuteAkrantiainDialog = create(
  require("./execute-akrantiain-dialog.scss"), "ExecuteAkrantiainDialog",
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

    const {trans} = useTrans("executeAkrantiainDialog");

    const {form, handleSubmit} = useExecuteAkrantiain();
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
                <ControlContainer>
                  <ControlLabel>{trans("label.input")}</ControlLabel>
                  <Input {...register("input")}/>
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