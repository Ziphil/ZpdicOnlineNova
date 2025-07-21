//

import {faBan} from "@fortawesome/sharp-regular-svg-icons";
import {useCallback} from "react";
import {useTrans} from "zographia";
import {useCommonAlert} from "/client/component/atom/common-alert";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";
import {Invitation} from "/server/internal/skeleton";


export function useAcceptInvitation(invitation: Invitation): () => void {
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const execute = useCallback(async function (): Promise<void> {
    const id = invitation.id;
    const response = await request("respondInvitation", {id, accept: true});
    await switchResponse(response, async () => {
      await invalidateResponses("fetchInvitations");
      dispatchSuccessToast(`acceptInvitation.${invitation.type}`);
    });
  }, [invitation.id, invitation.type, request, dispatchSuccessToast]);
  return execute;
}

export function useRejectInvitation(invitation: Invitation): () => void {
  const {trans} = useTrans("invitationList");
  const request = useRequest();
  const openAlert = useCommonAlert();
  const {dispatchSuccessToast} = useToast();
  const doRequest = useCallback(async function (): Promise<void> {
    const id = invitation.id;
    const response = await request("respondInvitation", {id, accept: false});
    await switchResponse(response, async () => {
      await invalidateResponses("fetchInvitations");
      dispatchSuccessToast(`rejectInvitation.${invitation.type}`);
    });
  }, [invitation.id, invitation.type, request, dispatchSuccessToast]);
  const execute = useCallback(function (): void {
    openAlert({
      message: trans("dialog.reject.message"),
      confirmLabel: trans("dialog.reject.confirm"),
      confirmIcon: faBan,
      onConfirm: doRequest
    });
  }, [doRequest, openAlert, trans]);
  return execute;
}