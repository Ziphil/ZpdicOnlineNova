//

import {CustomError} from "/server/model/error";
import {RECAPTCHA_SECRET} from "/server/variable";


export async function verifyRecaptcha(token: string): Promise<RecaptchaResult> {
  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    body: new URLSearchParams({
      "secret": RECAPTCHA_SECRET,
      "response": token
    })
  });
  const data = await response.json();
  if (response.status === 200 && data.success === true) {
    return data as RecaptchaResult;
  } else {
    throw new CustomError("recaptchaError");
  }
}

export type RecaptchaResult = {
  success: true,
  score: number,
  action: string,
  hostname: string
};