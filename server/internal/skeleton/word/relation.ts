//


export interface Relation {

  titles: Array<string>;
  number: number;
  name: string;

}


export namespace Relation {

  export const EMPTY = {
    titles: [],
    number: -1,
    name: ""
  } as Relation;

}