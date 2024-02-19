//

import {IconDefinition, faCheck, faClose, faExclamationTriangle} from "@fortawesome/sharp-regular-svg-icons";
import {MouseEvent, useCallback} from "react";
import {
  Alert,
  AlertBody,
  AlertCloseButton,
  AlertContent,
  AlertFooter,
  AlertIconContainer,
  AlertPane,
  Button,
  ButtonIconbag,
  GeneralIcon,
  MultiLineText,
  useAlert as useRawAlert,
  useTrans
} from "zographia";


export function useCommonAlert(): (config: CommonAlertConfig) => void {
  const {trans} = useTrans("commonAlert");
  const openAlert = useRawAlert();
  const openCommonAlert = useCallback(function (config: CommonAlertConfig): void {
    openAlert((close) => (
      <Alert scheme="red">
        <AlertPane>
          <AlertCloseButton/>
          <AlertBody>
            <AlertIconContainer>
              <GeneralIcon icon={faExclamationTriangle}/>
            </AlertIconContainer>
            <AlertContent>
              <MultiLineText>
                {config.message}
              </MultiLineText>
            </AlertContent>
          </AlertBody>
          <AlertFooter>
            <Button scheme="gray" variant="light" onClick={close}>
              <ButtonIconbag><GeneralIcon icon={config.cancelIcon ?? faClose}/></ButtonIconbag>
              {config.cancelLabel ?? trans("cancel")}
            </Button>
            <Button scheme="red" onClick={(event) => (config.onConfirm(event), close())}>
              <ButtonIconbag><GeneralIcon icon={config.confirmIcon ?? faCheck}/></ButtonIconbag>
              {config.confirmLabel ?? trans("confirm")}
            </Button>
          </AlertFooter>
        </AlertPane>
      </Alert>
    ));
  }, [openAlert, trans]);
  return openCommonAlert;
}

export type CommonAlertConfig = {
  message: string,
  cancelLabel?: string,
  confirmLabel?: string,
  cancelIcon?: IconDefinition,
  confirmIcon?: IconDefinition,
  onConfirm: (event: MouseEvent<HTMLButtonElement>) => unknown
};