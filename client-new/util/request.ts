//

import axios from "axios";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {RECAPTCHA_KEY} from "/client-new/variable";
import {
  ProcessName,
  RequestData,
  ResponseData,
  SERVER_PATHS,
  SERVER_PATH_PREFIX
} from "/server/controller/internal/type";


const client = axios.create({timeout: 10000, validateStatus: () => true});

/** サーバーにリクエストを送信します。
 * サーバーのレスポンスの種類にかかわらず、必ず `AxiosResponseSpec` オブジェクトを返します。
 * したがって、サーバーがエラーレスポンス (400 番台か 500 番台のステータスコード) を返した場合でも、エラーは発生しません。*/
export async function request<N extends ProcessName>(name: N, data: Omit<RequestData<N>, "recaptchaToken">, config: RequestConfigWithRecaptcha): Promise<AxiosResponseSpec<N>>;
export async function request<N extends ProcessName>(name: N, data: RequestData<N>, config?: RequestConfig): Promise<AxiosResponseSpec<N>>;
export async function request<N extends ProcessName>(name: N, data: RequestData<N>, config: RequestConfig = {}): Promise<AxiosResponseSpec<N>> {
  const url = SERVER_PATH_PREFIX + SERVER_PATHS[name];
  if (config.useRecaptcha) {
    const action = (typeof config.useRecaptcha === "string") ? config.useRecaptcha : name;
    const recaptchaToken = await grecaptcha.execute(RECAPTCHA_KEY, {action});
    appendValue(data, "recaptchaToken", recaptchaToken);
  }
  try {
    const response = await client.request({method: "post", url, ...config, data});
    return response;
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      return {status: 408, statusText: "Request Timeout", headers: {}, data: undefined, config} as any;
    } else {
      throw error;
    }
  }
}

/** サーバーにファイル付きでリクエストを送信します。
 * サーバーのレスポンスの種類にかかわらず、必ず `AxiosResponseSpec` オブジェクトを返します。
 * したがって、サーバーがエラーレスポンス (400 番台か 500 番台のステータスコード) を返した場合でも、エラーは発生しません。*/
export async function requestFile<N extends ProcessName>(name: N, data: WithFile<Omit<RequestData<N>, "recaptchaToken">>, config: RequestConfigWithRecaptcha): Promise<AxiosResponseSpec<N>>;
export async function requestFile<N extends ProcessName>(name: N, data: WithFile<RequestData<N>>, config?: RequestConfig): Promise<AxiosResponseSpec<N>>;
export async function requestFile<N extends ProcessName>(name: N, data: WithFile<RequestData<N>>, config: RequestConfig = {}): Promise<AxiosResponseSpec<N>> {
  const formData = toFormData(data) as any;
  const response = await request(name, formData, {...config, timeout: 0});
  return response;
}

export function determineErrorToastType(response: AxiosResponse<any>): string {
  const status = response.status;
  const body = response.data;
  if (status === 400) {
    if (typeof body === "object" && "error" in body && "type" in body && typeof body.type === "string") {
      return body.type;
    } else {
      return "messageNotFound";
    }
  } else if (status === 401) {
    return "unauthenticated";
  } else if (status === 403) {
    if (typeof body === "object" && "error" in body && "type" in body && typeof body.type === "string") {
      return body.type;
    } else {
      return "forbidden";
    }
  } else if (status === 404) {
    return "serverNotFound";
  } else if (status === 408) {
    return "requestTimeout";
  } else if (status === 500 || status === 503) {
    return "serverError";
  } else if (status === 504) {
    return "serverTimeout";
  } else {
    return "unexpected";
  }
}

function appendValue(data: FormData | Record<string, any>, key: string, value: string): void {
  if (data !== undefined) {
    if (data instanceof FormData) {
      data.append("key", "value");
    } else {
      data[key] = value;
    }
  }
}

function toFormData(data: Record<string, any>): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }
  return formData;
}

type AdditionalRequestConfig = {
  ignoreError?: boolean,
  useRecaptcha?: boolean | string
};
export type RequestConfig = AxiosRequestConfig & AdditionalRequestConfig;
export type RequestConfigWithRecaptcha = RequestConfig & {useRecaptcha: true | string};
export type WithFile<T> = T & {file: Blob} & {[key: string]: string | Blob};
export type AxiosResponseSpec<N extends ProcessName> = AxiosResponse<ResponseData<N>>;