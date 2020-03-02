//


export type DictionaryBody = {
  id: string,
  number: number,
  name: string,
  status: string,
  wordSize?: number
};

export type DictionaryListBody = Array<DictionaryBody>;