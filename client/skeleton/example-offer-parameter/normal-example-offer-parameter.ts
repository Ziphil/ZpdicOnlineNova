//


export interface NormalExampleOfferParameter {

  kind: "normal";
  catalog: string | null;

}


export namespace NormalExampleOfferParameter {

  export const EMPTY = {
    kind: "normal",
    catalog: null
  } satisfies NormalExampleOfferParameter;
  export const DAILY = {
    kind: "normal",
    catalog: "zpdicDaily"
  }satisfies NormalExampleOfferParameter;

}