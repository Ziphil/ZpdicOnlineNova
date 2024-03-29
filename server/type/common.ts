//


export type WithRecaptcha<T> = T & {recaptchaToken: string};
export type WithSize<T> = readonly [Array<T>, number];
