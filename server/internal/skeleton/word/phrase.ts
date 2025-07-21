//


export interface Phrase {

  titles: Array<string>;
  form: string;
  translations: Array<string>;
  translationString: string;
  ignoredPattern?: string;

}


export namespace Phrase {

  export const EMPTY = {
    titles: [],
    form: "",
    translations: [],
    translationString: ""
  } as Phrase;

}