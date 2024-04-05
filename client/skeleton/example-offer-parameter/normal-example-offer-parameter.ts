/* eslint-disable @typescript-eslint/no-namespace */


export interface NormalExampleOfferParameter {

  positionName: string | null;

}


export namespace NormalExampleOfferParameter {

  export const EMPTY = {
    positionName: null
  } satisfies NormalExampleOfferParameter;
  export const DAILY = {
    positionName: "zpdicDaily"
  }satisfies NormalExampleOfferParameter;

}