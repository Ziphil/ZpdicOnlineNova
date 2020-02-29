//

import axios from "axios";
import {
  AxiosResponse
} from "axios";
import {
  UserLoginBody
} from "../../server/type/user";


export async function get<T>(url: string): Promise<AxiosResponse<T>> {
  let response = await axios.get<T>(url, {headers: createHeaders()});
  return response;
}

export async function post<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
  let response = await axios.post<T>(url, data, {headers: createHeaders()});
  return response;
}

export async function login(url: string, name: string, password: string): Promise<boolean> {
  let result = await axios.post<UserLoginBody>(url, {name, password}, {headers: createHeaders()});
  let token = result.data.token;
  let authenticatedName = result.data.name;
  if (token && authenticatedName) {
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

export function isAuthenticated(): boolean {
  return !!localStorage.getItem("token");
}

function createHeaders(): any {
  let token = localStorage.getItem("token");
  let headers = {authorization: token};
  return headers;
}