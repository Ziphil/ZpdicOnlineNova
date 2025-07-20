//


export interface Phrase {

  titles: Array<string>;
  form: string;
  translations: Array<string>;

}


export namespace Phrase {

  export const EMPTY = {
    titles: [],
    form: "",
    translations: []
  } as Phrase;

}