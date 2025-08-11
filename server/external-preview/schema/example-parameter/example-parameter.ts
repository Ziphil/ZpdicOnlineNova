//

import {string} from "yup";


export const ExampleMode$In = string().oneOf(["sentence", "translation", "both", "tag", "content"]);

export const ExampleType$In = string().oneOf(["exact", "prefix", "suffix", "part", "regular"]);