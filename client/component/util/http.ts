//

import axios from "axios";
import {
  AxiosResponse
} from "axios";


export async function get<T>(url: string): Promise<AxiosResponse<T>> {
  let response = await axios.get<T>(url, {headers: createHeaders()});
  return response;
}

export async function post<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
  let response = await axios.post<T>(url, data, {headers: createHeaders()});
  return response;
}

function createHeaders(): any {
  let token = localStorage.getItem("token");
  let headers = {authorization: token};
  return headers;
}