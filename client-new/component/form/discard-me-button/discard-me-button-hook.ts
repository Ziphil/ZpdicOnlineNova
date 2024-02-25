//

import {faTrashAlt} from "@fortawesome/sharp-regular-svg-icons";
import {useCallback} from "react";
import {useNavigate} from "react-router";
import {useTrans} from "zographia";
import {useCommonAlert} from "/client-new/component/atom/common-alert";
import {useLogoutRequest} from "/client-new/hook/auth";
import {useRequest} from "/client-new/hook/request";
import {useToast} from "/client-new/hook/toast";
import {switchResponse} from "/client-new/util/response";


export function useDiscardMe(): () => void {
  const {trans} = useTrans("discardMeButton");
  const request = useRequest();
  const logout = useLogoutRequest();
  const openAlert = useCommonAlert();
  const {dispatchSuccessToast} = useToast();
  const navigate = useNavigate();
  const doRequest = useCallback(async function (): Promise<void> {
    const response = await request("discardUser", {});
    await switchResponse(response, async () => {
      await logout();
      navigate("/");
      dispatchSuccessToast("discardMe");
    });
  }, [request, logout, navigate, dispatchSuccessToast]);
  const execute = useCallback(function (): void {
    openAlert({
      message: trans("dialog.message"),
      confirmLabel: trans("dialog.confirm"),
      confirmIcon: faTrashAlt,
      onConfirm: doRequest
    });
  }, [doRequest, openAlert, trans]);
  return execute;
}