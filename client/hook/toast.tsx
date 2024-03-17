//

import {faCircleCheck, faCircleExclamation} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, ReactNode, useCallback} from "react";
import {GeneralIcon, Toast, ToastBody, ToastContent, ToastIconContainer, ToastSupplement, useToast as useRawToast, useTrans} from "zographia";


export function useToast(): ToastCallbacks {
  const {trans, transNode} = useTrans();
  const dispatchToast = useRawToast();
  const dispatchErrorToast = useCallback(function (type: string, values?: Record<string, ReactNode | ((parts: Array<ReactNode>) => ReactNode)>): void {
    const content = transNode(`toast.error.${type}`, values);
    dispatchToast(
      <Toast scheme="red">
        <ToastIconContainer>
          <GeneralIcon icon={faCircleExclamation}/>
        </ToastIconContainer>
        <ToastBody>
          <ToastContent>
            {content}
          </ToastContent>
        </ToastBody>
      </Toast>
    );
  }, [dispatchToast, transNode]);
  const dispatchSuccessToast = useCallback(function (type: string, values?: Record<string, string>): void {
    const lines = trans(`toast.success.${type}`, values).split("\n");
    const content = lines[0];
    const supplement = lines.slice(1).join("\n");
    dispatchToast(
      <Toast scheme="blue">
        <ToastIconContainer>
          <GeneralIcon icon={faCircleCheck}/>
        </ToastIconContainer>
        <ToastBody>
          <ToastContent>
            {content}
          </ToastContent>
          {(!!supplement) && (
            <ToastSupplement>
              {supplement}
            </ToastSupplement>
          )}
        </ToastBody>
      </Toast>
    );
  }, [dispatchToast, trans]);
  return {dispatchToast, dispatchErrorToast, dispatchSuccessToast};
}

type ToastCallbacks = {
  dispatchToast: (element: ReactElement) => void,
  dispatchErrorToast: (type: string) => void,
  dispatchSuccessToast: (type: string) => void
};