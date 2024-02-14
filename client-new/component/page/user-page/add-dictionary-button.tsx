//

import {faCheck} from "@fortawesome/sharp-regular-svg-icons";
import {Fragment, ReactElement, useCallback, useState} from "react";
import {AdditionalProps, Button, ButtonIconbag, ControlContainer, ControlLabel, Dialog, DialogBody, DialogCloseButton, DialogPane, GeneralIcon, Input, useTrans} from "zographia";
import {fakBookCirclePlus} from "/client-new/component/atom/icon";
import {create} from "/client-new/component/create";


export const AddDictionaryButton = create(
  null, "AddDictionaryButton",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("userPage");

    const [open, setOpen] = useState(false);

    const openDialog = useCallback(function (): void {
      setOpen(true);
    }, []);

    return (
      <Fragment>
        <Button variant="light" onClick={openDialog} {...rest}>
          <ButtonIconbag><GeneralIcon icon={fakBookCirclePlus}/></ButtonIconbag>
          {trans("button.addDictionary")}
        </Button>
        <Dialog open={open} onOpenSet={setOpen}>
          <DialogPane>
            <DialogCloseButton/>
            <DialogBody>
              <ControlContainer>
                <ControlLabel>
                  {trans("label.name")}
                </ControlLabel>
                <Input/>
              </ControlContainer>
              <div>
                <Button>
                  <ButtonIconbag><GeneralIcon icon={faCheck}/></ButtonIconbag>
                  {trans("button.confirm")}
                </Button>
              </div>
            </DialogBody>
          </DialogPane>
        </Dialog>
      </Fragment>
    );

  }
);