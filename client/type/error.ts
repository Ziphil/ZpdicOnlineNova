//


export type ErrorBody = {
  error: string
};

export type MayError<T> = T | ErrorBody;