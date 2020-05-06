//

import {
  ClientResponse
} from "@sendgrid/client/src/response";
import {
  EmailData
} from "@sendgrid/helpers/classes/email-address";
import {
  send as sendMailOriginal
} from "@sendgrid/mail";
import {
  randomBytes
} from "crypto";


export function takeLog(place: string, object: any): void {
  let objectString = (typeof object === "string") ? object : JSON.stringify(object);
  let message = `[${place}] ${objectString}`;
  console.log(message);
}

export function takeErrorLog(place: string, object: any, error: Error): void {
  let objectString = (typeof object === "string") ? object : JSON.stringify(object);
  let message = `[${place}] ${objectString}`;
  console.error(message);
  console.error(error);
}

export async function sendMail(to: EmailData, subject: string, html: string): Promise<ClientResponse> {
  let from = {name: "ZpDIC Online", email: "info@zpdic.ziphil.com"};
  let message = {to, from, subject, html};
  let response = await sendMailOriginal(message);
  return response[0];
}

export function createRandomString(length: number, addDate?: boolean): string {
  let string = randomBytes(length).toString("base64").substring(0, length).replace("+", "-").replace("/", "_");
  if (addDate) {
    let date = new Date();
    string += date.getTime();
  }
  return string;
}