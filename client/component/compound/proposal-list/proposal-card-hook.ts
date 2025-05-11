import {faTrashAlt} from "@fortawesome/sharp-regular-svg-icons";
import {useCallback} from "react";
import {useTrans} from "zographia";
import {useCommonAlert} from "/client/component/atom/common-alert";
import {invalidateResponses, useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {Dictionary, Proposal} from "/client/skeleton";
import {switchResponse} from "/client/util/response";


export function useDiscardProposal(dictionary: Dictionary, proposal: Proposal): () => void {
  const {trans} = useTrans("proposalList");
  const request = useRequest();
  const openAlert = useCommonAlert();
  const {dispatchSuccessToast} = useToast();
  const doRequest = useCallback(async function (): Promise<void> {
    const number = dictionary.number;
    const id = proposal.id;
    const response = await request("discardProposal", {number, id});
    await switchResponse(response, async () => {
      await invalidateResponses("fetchProposals", (query) => query.number === dictionary.number);
      dispatchSuccessToast("discardProposal");
    });
  }, [dictionary.number, proposal.id, request, dispatchSuccessToast]);
  const execute = useCallback(function (): void {
    openAlert({
      message: trans("dialog.discard.message"),
      confirmLabel: trans("dialog.discard.confirm"),
      confirmIcon: faTrashAlt,
      onConfirm: doRequest
    });
  }, [doRequest, openAlert, trans]);
  return execute;
}