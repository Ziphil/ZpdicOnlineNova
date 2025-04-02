//

import {object, string} from "yup";


export const NORMAL_EXAMPLE_OFFER_PARAMETER = object({
  catalog: string().defined()
});