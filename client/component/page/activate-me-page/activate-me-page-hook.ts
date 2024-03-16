//

import {useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {useRequest} from "/client/hook/request";
import {useToast} from "/client/hook/toast";
import {switchResponse} from "/client/util/response";


export function useActivateUser(tokenKey: string): () => Promise<void> {
  const request = useRequest();
  const {dispatchSuccessToast} = useToast();
  const navigate = useNavigate();
  const execute = useCallback(async function (): Promise<void> {
    const response = await request("activateMe", {key: tokenKey});
    await switchResponse(response, async (body) => {
      const user = body;
      navigate(`/user/${user.name}`, {replace: true});
      dispatchSuccessToast("activateMe");
    }, async () => {
      navigate("/", {replace: true});
    });
  }, [tokenKey, request, navigate, dispatchSuccessToast]);
  return execute;
}