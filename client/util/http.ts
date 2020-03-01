//

import axios from "axios";
import {
  AxiosResponse
} from "axios";
import {
  UserBody,
  UserLoginBody
} from "/client/type/user";


export async function get<T>(url: string): Promise<AxiosResponse<T>> {
  let response = await axios.get<T>(url, {headers: createHeaders()});
  return response;
}

export async function post<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
  let response = await axios.post<T>(url, data, {headers: createHeaders()});
  return response;
}

export async function login(url: string, name: string, password: string): Promise<boolean> {
  let response = await post<UserLoginBody>(url, {name, password});
  let token = response.data.token;
  let authenticatedName = response.data.name;
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