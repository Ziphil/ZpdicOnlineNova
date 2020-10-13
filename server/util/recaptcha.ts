//

import axios from "axios";
import {
  CustomError
} from "/server/model/error";
import {
  RECAPTCHA_SECRET
} from "/server/variable";


export class RecaptchaUtil {

  public static async verify(token: string): Promise<RecaptchaResult> {
    const data = new URLSearchParams();
    data.append("secret", RECAPTCHA_SECRET);
    data.append("response", token);
    let response = await axios.post("https://www.google.com/recaptcha/api/siteverify", data);
    if (response.status === 200 && response.data.success) {
      return response.data;
    } else {
      throw new CustomError("recaptchaError");
    }
  }

}


export type RecaptchaResult = {
  success: true,
  score: number,
  action: string,
  hostname: string
};