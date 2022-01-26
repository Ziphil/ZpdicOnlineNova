//

import axios from "axios";
import {
  AxiosRequestConfig,
  AxiosResponse
} from "axios";
import {
  useCallback
} from "react";
import {
  usePopup
} from "/client/component/hook/popup";
import {
  useRawUser
} from "/client/component/hook/user";
import {
  RECAPTCHA_KEY
} from "/client/variable";
import {
  ProcessName,
  RequestData,
  ResponseData,
  SERVER_PATHS,
  SERVER_PATH_PREFIX
} from "/server/controller/internal/type";


let client = axios.create({timeout: 10000, validateStatus: () => true});

function useCatchError(): <T>(response: AxiosResponse<T>) => AxiosResponse<T> {
  let [, {addErrorPopup}] = usePopup();
  let [, setUser] = useRawUser();
  let catchError = useCallback(function <T>(response: AxiosResponse<T>): AxiosResponse<T> {
    let status = response.status;
    let body = response.data as any;
    if (status === 400) {
      if (typeof body === "object" && "error" in body && "type" in body && typeof body.type === "string") {
        addErrorPopup(body.type);
      } else {
        addErrorPopup("messageNotFound");
      }
    } else if (status === 401) {
      addErrorPopup("unauthenticated");
      setUser(null);
    } else if (status === 403) {
      if (typeof body === "object" && "error" in body && "type" in body && typeof body.type === "string") {
        addErrorPopup(body.type);
      } else {
        addErrorPopup("forbidden");
      }
    } else if (status === 404) {
      addErrorPopup("serverNotFound");
    } else if (status === 408) {
      addErrorPopup("requestTimeout");
    } else if (status === 500 || status === 503) {
      addErrorPopup("serverError");
    } else if (status === 504) {
      addErrorPopup("serverTimeout");
    } else {
      addErrorPopup("unexpected");
    }
    return response;
  }, [addErrorPopup, setUser]);
  return catchError;
}

export function useRequest(): RequestCallbacks {
  let catchError = useCatchError();
  let request = useCallback(async function <N extends ProcessName>(name: N, data: RequestData<N>, config: RequestConfig = {}): Promise<AxiosResponseSpec<N>> {
    let url = SERVER_PATH_PREFIX + SERVER_PATHS[name];
    let method = "post" as const;
    if (config.useRecaptcha) {
      let action = (typeof config.useRecaptcha === "string") ? config.useRecaptcha : name;
      let recaptchaToken = await grecaptcha.execute(RECAPTCHA_KEY, {action});
      if (data !== undefined) {
        if (data instanceof FormData) {
          data.append("recaptchaToken", recaptchaToken);
        } else {
          data = {...data, recaptchaToken};
        }
      }
    }
    let response = await (async () => {
      try {
        return await client.request({url, method, ...config, data});
      } catch (error) {
        if (error.code === "ECONNABORTED") {
          let data = undefined as any;
          let headers = config.headers;
          return {status: 408, statusText: "Request Timeout", data, headers, config};
        } else {
          throw error;
        }
      }
    })();
    if ((config.ignoreError === undefined || !config.ignoreError) && response.status >= 400) {
      catchError(response);
    }
    return response;
  }, [catchError]);
  let requestFile = useCallback(async function <N extends ProcessName>(name: N, data: WithFile<RequestData<N>>, config: RequestConfig = {}): Promise<AxiosResponseSpec<N>> {
    let formData = new FormData() as any;
    for (let [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }
    let nextConfig = {...config, timeout: 0};
    let response = await request(name, formData, nextConfig);
    return response;
  }, [request]);
  return {request, requestFile};
}

export function useLogin(): (data: RequestData<"login">, config?: RequestConfig) => Promise<AxiosResponseSpec<"login">> {
  let {request} = useRequest();
  let [, setUser] = useRawUser();
  let login = useCallback(async function (data: RequestData<"login">, config?: RequestConfig): Promise<AxiosResponseSpec<"login">> {
    let response = await request("login", data, config);
    if (response.status === 200) {
      let body = response.data;
      setUser(body.user);
    }
    return response;
  }, [request, setUser]);
  return login;
}

export function useLogout(): (config?: RequestConfig) => Promise<AxiosResponseSpec<"logout">> {
  let {request} = useRequest();
  let [, setUser] = useRawUser();
  let logout = useCallback(async function (config?: RequestConfig): Promise<AxiosResponseSpec<"logout">> {
    let response = await request("logout", {}, config);
    if (response.status === 200) {
      setUser(null);
    }
    return response;
  }, [request, setUser]);
  return logout;
}

type RequestCallbacks = {
  request: RequestCallback,
  requestFile: RequestFileCallback
};
type RequestCallback = {
  <N extends ProcessName>(name: N, data: Omit<RequestData<N>, "recaptchaToken">, config: RequestConfigWithRecaptcha): Promise<AxiosResponseSpec<N>>,
  <N extends ProcessName>(name: N, data: RequestData<N>, config?: RequestConfig): Promise<AxiosResponseSpec<N>>
};
type RequestFileCallback = {
  <N extends ProcessName>(name: N, data: WithFile<Omit<RequestData<N>, "recaptchaToken">>, config: RequestConfigWithRecaptcha): Promise<AxiosResponseSpec<N>>;
  <N extends ProcessName>(name: N, data: WithFile<RequestData<N>>, config?: RequestConfig): Promise<AxiosResponseSpec<N>>;
};

type AdditionalRequestConfig = {
  ignoreError?: boolean,
  useRecaptcha?: boolean | string
};
type RequestConfig = AxiosRequestConfig & AdditionalRequestConfig;
type RequestConfigWithRecaptcha = RequestConfig & {useRecaptcha: true | string};
type WithFile<T> = T & {file: Blob} & {[key: string]: string | Blob};
type AxiosResponseSpec<N extends ProcessName> = AxiosResponse<ResponseData<N>>;