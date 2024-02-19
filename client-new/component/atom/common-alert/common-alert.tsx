/* eslint-disable no-useless-computed-key */

import {IconDefinition, faCheck, faClose, faExclamationTriangle} from "@fortawesome/sharp-regular-svg-icons";
import {MouseEvent, ReactElement, useCallback} from "react";
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
  useTrans
} from "zographia";
import {create} from "/client-new/component/create";


export const CommonAlert = create(
  null, "CommonAlert",
  function ({
    config,
    close,
    ...rest
  }: {
    config: CommonAlertConfig,
    close: () => void,
    className?: string
  }): ReactElement | null {

    const {trans} = useTrans("commonAlert");

    const handleConfirm = useCallback(async function (event: MouseEvent<HTMLButtonElement>): Promise<void> {
      await config.onConfirm(event);
      close();
    }, [config, close]);

    return (
      <Alert scheme="red" {...rest}>
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
            <Button scheme="red" onClick={handleConfirm}>
              <ButtonIconbag><GeneralIcon icon={config.confirmIcon ?? faCheck}/></ButtonIconbag>
              {config.confirmLabel ?? trans("confirm")}
            </Button>
          </AlertFooter>
        </AlertPane>
      </Alert>
    );

  }
);


export type CommonAlertConfig = {
  message: string,
  cancelLabel?: string,
  confirmLabel?: string,
  cancelIcon?: IconDefinition,
  confirmIcon?: IconDefinition,
  onConfirm: (event: MouseEvent<HTMLButtonElement>) => unknown
};