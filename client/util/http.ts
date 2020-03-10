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


export async function get<N extends ProcessName>(name: N, params: RequestType<N, "get">, allowedStatuses?: Array<number>): Promise<AxiosResponse<ResponseType<N, "get">>> {
  let url = SERVER_PATH[name];
  let validateStatus = createValidateStatus(allowedStatuses);
  let response = await axios.get<ResponseType<N, "get">>(url, {params, validateStatus});
  return response;
}

export async function post<N extends ProcessName>(name: N, data: RequestType<N, "post">, allowedStatuses?: Array<number>): Promise<AxiosResponse<ResponseType<N, "post">>> {
  let url = SERVER_PATH[name];
  let validateStatus = createValidateStatus(allowedStatuses);
  let response = await axios.post<ResponseType<N, "post">>(url, data, {validateStatus});
  return response;
}

export async function postFile<N extends ProcessName>(name: N, data: RequestType<N, "post"> & {file: Blob}, allowedStatuses?: Array<number>): Promise<AxiosResponse<ResponseType<N, "post">>> {
  let url = SERVER_PATH[name];
  let validateStatus = createValidateStatus(allowedStatuses);
  let headers = {} as any;
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
  try {
    let response = await post("login", data);
    let body = response.data;
    let token = body.token;
    let authenticatedName = body.name;
    localStorage.setItem("login", "true");
    return true;
  } catch (error) {
    if (error.response?.status === 401) {
      return false;
    } else {
      throw error;
    }
  }
}

export async function logout(): Promise<boolean> {
  let response = await post("logout", {});
  localStorage.removeItem("login");
  return true;
}

export function hasToken(): boolean {
  return !!localStorage.getItem("login");
}

export async function isAuthenticated(): Promise<boolean> {
  return false;
}

function createValidateStatus(allowedStatuses?: Array<number>): (status: number) => boolean {
  let validateStatus = function (status: number): boolean {
    return (status >= 200 && status < 300) || (!!allowedStatuses && allowedStatuses.includes(status));
  };
  return validateStatus;
}