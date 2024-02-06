//

import {IconDefinition, faCheck, faClose, faExclamationTriangle} from "@fortawesome/sharp-regular-svg-icons";
import {MouseEvent, useCallback} from "react";
import {
  Button,
  ButtonIconbag,
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogIconContainer,
  DialogPane,
  GeneralIcon,
  MultiLineText,
  useDialog as useRawDialog,
  useTrans
} from "zographia";


export function useAlertDialog(): (config: AlertDialogConfig) => void {
  const {trans} = useTrans("alertDialog");
  const openDialog = useRawDialog();
  const openAlertDialog = useCallback(function (config: AlertDialogConfig): void {
    openDialog((close) => (
      <Dialog scheme="red">
        <DialogPane>
          <DialogCloseButton/>
          <DialogBody>
            <DialogIconContainer>
              <GeneralIcon icon={faExclamationTriangle}/>
            </DialogIconContainer>
            <DialogContent>
              <MultiLineText>
                {config.message}
              </MultiLineText>
            </DialogContent>
          </DialogBody>
          <DialogFooter>
            <Button scheme="gray" variant="light" onClick={close}>
              <ButtonIconbag><GeneralIcon icon={config.cancelIcon ?? faClose}/></ButtonIconbag>
              {config.cancelLabel ?? trans("cancel")}
            </Button>
            <Button scheme="red" onClick={config.onConfirm}>
              <ButtonIconbag><GeneralIcon icon={config.confirmIcon ?? faCheck}/></ButtonIconbag>
              {config.confirmLabel ?? trans("confirm")}
            </Button>
          </DialogFooter>
        </DialogPane>
      </Dialog>
    ));
  }, [openDialog, trans]);
  return openAlertDialog;
}

export type AlertDialogConfig = {
  message: string,
  cancelLabel?: string,
  confirmLabel?: string,
  cancelIcon?: IconDefinition,
  confirmIcon?: IconDefinition,
  onConfirm: (event: MouseEvent<HTMLButtonElement>) => unknown
};