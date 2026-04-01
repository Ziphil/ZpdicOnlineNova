//

import {appendValueToFormData, toFormData} from "/client/util/form-data";
import {RECAPTCHA_KEY, VERSION} from "/client/variable";
import type {ProcessName, RequestData, ResponseData} from "/server/internal/type/rest";


export const SERVER_PATH_PREFIX = "/internal/" + VERSION;

/** サーバーにリクエストを送信します。
 * サーバーのレスポンスの種類にかかわらず、必ず `InternalApiResponse` オブジェクトを返します。
 * したがって、サーバーがエラーレスポンス (400 番台か 500 番台のステータスコード) を返した場合でも、エラーは発生しません。*/
export async function request<N extends ProcessName>(name: N, data: Omit<RequestData<N>, "recaptchaToken">, config: RequestConfigWithRecaptcha): Promise<CommonResponse<N>>;
export async function request<N extends ProcessName>(name: N, data: RequestData<N>, config?: RequestConfig): Promise<CommonResponse<N>>;
export async function request<N extends ProcessName>(name: N, data: RequestData<N>, config: RequestConfig = {}): Promise<CommonResponse<N>> {
  const url = SERVER_PATH_PREFIX + "/" + name;
  if (config.useRecaptcha) {
    const action = (typeof config.useRecaptcha === "string") ? config.useRecaptcha : name;
    const recaptchaToken = await grecaptcha.execute(RECAPTCHA_KEY, {action});
    appendValueToFormData(data, "recaptchaToken", recaptchaToken);
  }
  const controller = new AbortController();
  const timeout = (config.timeout !== null) ? window.setTimeout(() => controller.abort(), config.timeout || 10000) : undefined;
  const headers = new Headers(config.headers);
  const body = createRequestBody(data, headers);
  try {
    const response = await fetch(url, {method: "post", headers, body, signal: controller.signal});
    const responseData = await createResponseData(response, config.responseType);
    return {
      status: response.status,
      statusText: response.statusText,
      headers: convertHeaders(response.headers),
      data: responseData,
      config
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return {
        status: 408,
        statusText: "Request Timeout",
        headers: {},
        data: undefined,
        config
      };
    } else {
      throw error;
    }
  } finally {
    if (timeout !== undefined) {
      window.clearTimeout(timeout);
    }
  }
}

/** サーバーにファイル付きでリクエストを送信します。
 * サーバーのレスポンスの種類にかかわらず、必ず `InternalApiResponse` オブジェクトを返します。
 * したがって、サーバーがエラーレスポンス (400 番台か 500 番台のステータスコード) を返した場合でも、エラーは発生しません。*/
export async function requestFile<N extends ProcessName>(name: N, data: WithFile<Omit<RequestData<N>, "recaptchaToken">>, config: RequestConfigWithRecaptcha): Promise<CommonResponse<N>>;
export async function requestFile<N extends ProcessName>(name: N, data: WithFile<RequestData<N>>, config?: RequestConfig): Promise<CommonResponse<N>>;
export async function requestFile<N extends ProcessName>(name: N, data: WithFile<RequestData<N>>, config: RequestConfig = {}): Promise<CommonResponse<N>> {
  const formData = toFormData(data) as any;
  const response = await request(name, formData, {...config, timeout: null});
  return response;
}

export function determineErrorToastType<N extends ProcessName>(response: Pick<CommonResponse<N>, "status" | "data">): string {
  const status = response.status;
  const body = response.data;
  if (status === 400) {
    if (typeof body === "object" && body !== null && "error" in body && "type" in body && typeof body.type === "string") {
      return body.type;
    } else {
      return "messageNotFound";
    }
  } else if (status === 401) {
    return "unauthenticated";
  } else if (status === 403) {
    if (typeof body === "object" && body !== null && "error" in body && "type" in body && typeof body.type === "string") {
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


function createRequestBody(data: FormData | RequestData<ProcessName>, headers: Headers): BodyInit {
  if (data instanceof FormData) {
    return data;
  } else {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    return JSON.stringify(data);
  }
}

async function createResponseData(response: Response, responseType?: "blob" | "json"): Promise<unknown> {
  if (responseType === "blob") {
    return await response.blob();
  } else {
    return await response.json();
  }
}

function convertHeaders(headers: Headers): Record<string, string> {
  const result: Record<string, string> = {};
  headers.forEach((value, key) => {
    result[key.toLowerCase()] = value;
  });
  return result;
}

export type RequestConfig = {
  headers?: Record<string, string>,
  timeout?: number | null,
  responseType?: "blob" | "json",
  ignoreError?: boolean,
  useRecaptcha?: boolean | string
};
export type RequestConfigWithRecaptcha = RequestConfig & {useRecaptcha: true | string};
export type WithFile<T> = T & {file: Blob} & {[key: string]: string | Blob};

export type CommonResponse<N extends ProcessName> = {
  status: number,
  statusText: string,
  headers: Record<string, string>,
  config: RequestConfig,
  data: ResponseData<N>
};