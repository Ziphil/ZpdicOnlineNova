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
import {create} from "/client-new/component/create";


export const ExecuteAkrantiainDialog = create(
  require("./execute-akrantiain-dialog.scss"), "ExecuteAkrantiainDialog",
  function ({
    trigger,
    ...rest
  }: {
    trigger: ReactElement,
    className?: string
  }): ReactElement {

    const {trans} = useTrans("executeAkrantiainDialog");

    const [open, setOpen] = useState(false);

    const openDialog = useCallback(function (): void {
      setOpen(true);
    }, []);

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
                  <Textarea styleName="textarea-source" fontFamily="monospace"/>
                </ControlContainer>
                <ControlContainer>
                  <ControlLabel>{trans("label.input")}</ControlLabel>
                  <Input/>
                </ControlContainer>
              </fieldset>
              <div>
                <Button>
                  <ButtonIconbag><GeneralIcon icon={faPlay}/></ButtonIconbag>
                  {trans("button.execute")}
                </Button>
              </div>
              <fieldset styleName="column">
                <ControlContainer>
                  <ControlLabel>{trans("label.output")}</ControlLabel>
                  <Input/>
                </ControlContainer>
                <ControlContainer>
                  <ControlLabel>{trans("label.error")}</ControlLabel>
                  <Textarea styleName="textarea-error" fontFamily="monospace"/>
                </ControlContainer>
              </fieldset>
            </DialogBody>
          </DialogPane>
        </Dialog>
      </Fragment>
    );

  }
);