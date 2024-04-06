/* eslint-disable @typescript-eslint/no-namespace */


export interface NormalExampleOfferParameter {

  kind: "normal";
  positionName: string | null;

}


export namespace NormalExampleOfferParameter {

  export const EMPTY = {
    kind: "normal",
    positionName: null
  } satisfies NormalExampleOfferParameter;
  export const DAILY = {
    kind: "normal",
    positionName: "zpdicDaily"
  }satisfies NormalExampleOfferParameter;

}