//

import axios from "axios";
import {
  AxiosResponse
} from "axios";
import {
  RequestBody,
  RequestQuery,
  ResponseBody,
  SERVER_PATH
} from "/server/controller/type";


export async function get<T extends GetType>(type: T, params: AnyRecord<RequestQuery[T]>, allowedStatuses?: Array<number>): Promise<AxiosResponse<ResponseBody[T]>> {
  let url = SERVER_PATH[type];
  let headers = createHeaders();
  let validateStatus = createValidateStatus(allowedStatuses);
  let response = await axios.get<ResponseBody[T]>(url, {headers, params, validateStatus});
  return response;
}

export async function post<T extends PostType>(type: T, data: AnyRecord<RequestBody[T]>, allowedStatuses?: Array<number>): Promise<AxiosResponse<ResponseBody[T]>> {
  let url = SERVER_PATH[type];
  let headers = createHeaders();
  let validateStatus = createValidateStatus(allowedStatuses);
  let response = await axios.post<ResponseBody[T]>(url, data, {headers, validateStatus});
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

type GetType = keyof RequestQuery & keyof ResponseBody;
type PostType = keyof RequestBody & keyof ResponseBody;

type AnyRecord<T> = {[N in keyof T]: any};