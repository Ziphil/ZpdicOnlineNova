//

import {LoaderFunctionArgs} from "react-router-dom";
import {fetchResponse} from "/client-new/hook/request";
import {ResponseError} from "/client-new/util/error";


export async function loadUserNotificationPart({params}: LoaderFunctionArgs): Promise<null> {
  const {name} = params;;
  try {
    const [me, user] = await Promise.all([
      fetchResponse("fetchUser", {}),
      fetchResponse("fetchOtherUser", {name: name!})
    ]);
    if (me.name === user.name) {
      return null;
    } else {
      throw new Response(null, {status: 403});
    }
  } catch (error) {
    throw convertError(error);
  }
}

function convertError(error: unknown): unknown {
  if (ResponseError.isResponseError(error)) {
    if (error.status === 401) {
      return new Response(JSON.stringify(error), {status: 403});
    } else if (error.type === "noSuchUser") {
      return new Response(JSON.stringify(error), {status: 404});
    } else {
      return error;
    }
  } else {
    return error;
  }
}