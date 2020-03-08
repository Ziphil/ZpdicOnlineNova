//

import axios from "axios";
import {
  AxiosResponse
} from "axios";
import {
  ProcessName,
  RequestType,
  ResponseType,
  SERVER_PATH
} from "/server/controller/type";


export async function get<N extends ProcessName>(name: N, params: AnyRecord<RequestType<N, "get">>, allowedStatuses?: Array<number>): Promise<AxiosResponse<ResponseType<N, "get">>> {
  let url = SERVER_PATH[name];
  let headers = createHeaders();
  let validateStatus = createValidateStatus(allowedStatuses);
  let response = await axios.get<ResponseType<N, "get">>(url, {headers, params, validateStatus});
  return response;
}

export async function post<N extends ProcessName>(name: N, data: AnyRecord<RequestType<N, "post">>, allowedStatuses?: Array<number>): Promise<AxiosResponse<ResponseType<N, "post">>> {
  let url = SERVER_PATH[name];
  let headers = createHeaders();
  let validateStatus = createValidateStatus(allowedStatuses);
  let response = await axios.post<ResponseType<N, "post">>(url, data, {headers, validateStatus});
  return response;
}

export async function postFile<N extends ProcessName>(name: N, data: AnyRecord<RequestType<N, "post">> & {file: Blob}, allowedStatuses?: Array<number>): Promise<AxiosResponse<ResponseType<N, "post">>> {
  let url = SERVER_PATH[name];
  let headers = createHeaders();
  let validateStatus = createValidateStatus(allowedStatuses);
  let anyData = data as any;
  let nextData = new FormData();
  for (let key of Object.keys(data)) {
    nextData.append(key, anyData[key]);
  }
  headers["content-type"] = "multipart/form-data";
  let response = await axios.post<ResponseType<N, "post">>(url, nextData, {headers, validateStatus});
  return response;
}

export async function login(data: {name: string, password: string}): Promise<boolean> {
  let response = await post("userLogin", data, [400]);
  let body = response.data;
  if (!("error" in body)) {
    let token = body.token;
    let authenticatedName = body.name;
    localStorage.setItem("token", token);
    localStorage.setItem("name", authenticatedName);
    return true;
  } else {
    return false;
  }
}

export async function logout(): Promise<void> {
  localStorage.removeItem("token");
  localStorage.removeItem("name");
}

export function hasToken(): boolean {
  return !!localStorage.getItem("token");
}

export async function isAuthenticated(): Promise<boolean> {
  return false;
}

function createHeaders(): any {
  let token = localStorage.getItem("token");
  let headers = {authorization: token};
  return headers;
}

function createValidateStatus(allowedStatuses?: Array<number>): (status: number) => boolean {
  let validateStatus = function (status: number): boolean {
    return (status >= 200 && status < 300) || (!!allowedStatuses && allowedStatuses.includes(status));
  };
  return validateStatus;
}

type AnyRecord<T> = {[N in keyof T]: any};