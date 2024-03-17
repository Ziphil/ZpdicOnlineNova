//


export type WithRecaptcha<T> = T & {recaptchaToken: string};
export type WithSize<T> = [Array<T>, number];
