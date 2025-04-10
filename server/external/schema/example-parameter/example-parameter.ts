//

import {string} from "yup";


export const EXAMPLE_MODE = string().oneOf(["sentence", "translation", "both", "tag", "content"]);

export const EXAMPLE_TYPE = string().oneOf(["exact", "prefix", "suffix", "part", "regular"]);