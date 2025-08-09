//


export interface Relation {

  titles: Array<string>;
  number: number;
  spelling: string;

}


export namespace Relation {

  export const EMPTY = {
    titles: [],
    number: -1,
    spelling: ""
  } as Relation;

}