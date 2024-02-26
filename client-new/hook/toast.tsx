//

import {faCircleCheck, faCircleExclamation} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, ReactNode, useCallback} from "react";
import {GeneralIcon, Toast, ToastBody, ToastContent, ToastIconContainer, useToast as useRawToast, useTrans} from "zographia";


export function useToast(): ToastCallbacks {
  const {transNode} = useTrans();
  const dispatchToast = useRawToast();
  const dispatchErrorToast = useCallback(function (type: string, values?: Record<string, ReactNode | ((parts: Array<ReactNode>) => ReactNode)>): void {
    dispatchToast(
      <Toast scheme="red">
        <ToastIconContainer>
          <GeneralIcon icon={faCircleExclamation}/>
        </ToastIconContainer>
        <ToastBody>
          <ToastContent>
            {transNode(`toast.error.${type}`, values)}
          </ToastContent>
        </ToastBody>
      </Toast>
    );
  }, [dispatchToast, transNode]);
  const dispatchSuccessToast = useCallback(function (type: string, values?: Record<string, ReactNode | ((parts: Array<ReactNode>) => ReactNode)>): void {
    dispatchToast(
      <Toast scheme="blue">
        <ToastIconContainer>
          <GeneralIcon icon={faCircleCheck}/>
        </ToastIconContainer>
        <ToastBody>
          <ToastContent>
            {transNode(`toast.success.${type}`, values)}
          </ToastContent>
        </ToastBody>
      </Toast>
    );
  }, [dispatchToast, transNode]);
  return {dispatchToast, dispatchErrorToast, dispatchSuccessToast};
}

type ToastCallbacks = {
  dispatchToast: (element: ReactElement) => void,
  dispatchErrorToast: (type: string) => void,
  dispatchSuccessToast: (type: string) => void
};