//

import axios from "axios";
import {
  AxiosResponse
} from "axios";
import {
  UserLoginBody
} from "/server/controller/user";


export async function get<T>(url: string, params?: any, allowedStatuses?: Array<number>): Promise<AxiosResponse<T>> {
  let headers = createHeaders();
  let validateStatus = createValidateStatus(allowedStatuses);
  let response = await axios.get<T>(url, {headers, params, validateStatus});
  return response;
}

export async function post<T>(url: string, data?: any, allowedStatuses?: Array<number>): Promise<AxiosResponse<T>> {
  let headers = createHeaders();
  let validateStatus = createValidateStatus(allowedStatuses);
  let response = await axios.post<T>(url, data, {headers, validateStatus});
  return response;
}

export async function login(name: string, password: string): Promise<boolean> {
  let response = await post<UserLoginBody>("/api/user/login", {name, password}, [400]);
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