//

import axios from "axios";
import {
  AxiosResponse
} from "axios";


type LoginResult = {token: string, name: string};

export async function get<T>(url: string): Promise<AxiosResponse<T>> {
  let response = await axios.get<T>(url, {headers: createHeaders()});
  return response;
}

export async function post<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
  let response = await axios.post<T>(url, data, {headers: createHeaders()});
  return response;
}

export async function login(url: string, name: string, password: string): Promise<void> {
  let result = await post<LoginResult>(url, {name, password});
  if (result.data) {
    localStorage.setItem("token", result.data.token);
    localStorage.setItem("name", result.data.name);
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