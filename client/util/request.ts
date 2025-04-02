//

import axios from "axios";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {appendValueToFormData, toFormData} from "/client/util/form-data";
import {RECAPTCHA_KEY, VERSION} from "/client/variable";
import type {ProcessName, RequestData, ResponseData} from "/server/internal/type/rest";


export const SERVER_PATH_PREFIX = "/internal/" + VERSION;

const client = axios.create({timeout: 10000, validateStatus: () => true});

/** サーバーにリクエストを送信します。
 * サーバーのレスポンスの種類にかかわらず、必ず `AxiosResponseSpec` オブジェクトを返します。
 * したがって、サーバーがエラーレスポンス (400 番台か 500 番台のステータスコード) を返した場合でも、エラーは発生しません。*/
export async function request<N extends ProcessName>(name: N, data: Omit<RequestData<N>, "recaptchaToken">, config: RequestConfigWithRecaptcha): Promise<AxiosResponseSpec<N>>;
export async function request<N extends ProcessName>(name: N, data: RequestData<N>, config?: RequestConfig): Promise<AxiosResponseSpec<N>>;
export async function request<N extends ProcessName>(name: N, data: RequestData<N>, config: RequestConfig = {}): Promise<AxiosResponseSpec<N>> {
  const url = SERVER_PATH_PREFIX + "/" + name;
  if (config.useRecaptcha) {
    const action = (typeof config.useRecaptcha === "string") ? config.useRecaptcha : name;
    const recaptchaToken = await grecaptcha.execute(RECAPTCHA_KEY, {action});
    appendValueToFormData(data, "recaptchaToken", recaptchaToken);
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

export function determineAwsErrorToastType(error: any): string {
  if (error.name === "AwsError") {
    const code = error.data["Code"]["_text"];
    const message = error.data["Message"]["_text"];
    if (code === "EntityTooLarge") {
      return "resourceSizeTooLarge";
    } else if (code === "AccessDenied" && message.includes("Policy Condition failed") && message.includes("$Content-Type")) {
      return "unsupportedResourceType";
    } else {
      return "awsError";
    }
  } else {
    return "unexpected";
  }
}

type AdditionalRequestConfig = {
  ignoreError?: boolean,
  useRecaptcha?: boolean | string
};
export type RequestConfig = AxiosRequestConfig & AdditionalRequestConfig;
export type RequestConfigWithRecaptcha = RequestConfig & {useRecaptcha: true | string};
export type WithFile<T> = T & {file: Blob} & {[key: string]: string | Blob};
export type AxiosResponseSpec<N extends ProcessName> = AxiosResponse<ResponseData<N>>;