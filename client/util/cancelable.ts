//


export class CancelablePromise<T> implements Promise<T> {

  private wrappedPromise: Promise<T>;
  private canceled: boolean;

  public constructor(promise: PromiseLike<T>) {
    this.wrappedPromise = new Promise<T>((resolve, reject) => {
      promise.then((value) => {
        if (this.canceled) {
          reject({canceled: true});
        } else {
          resolve(value);
        }
      }, (error) => {
        if (this.canceled) {
          reject({canceled: true});
        } else {
          reject(error);
        }
      });
    });
    this.canceled = false;
  }

  public then<R = T, S = never>(onResolve?: ResolveCallback<T, R> | null, onReject?: RejectCallback<S> | null): Promise<R | S> {
    return this.wrappedPromise.then(onResolve, onReject);
  }

  public catch<S = never>(onReject?: RejectCallback<S> | null): Promise<T | S> {
    return this.wrappedPromise.catch(onReject);
  }

  public finally(onFinally?: FinallyCallback | null): Promise<T> {
    return this.finally(onFinally);
  }

  /** このオブジェクトが表す処理を行った後に `then` や `catch` で登録された処理を実行するのをキャンセルします。
   * このオブジェクトが表す処理そのものが中断されるわけではありません。*/
  public cancel(): void {
    this.canceled = true;
  }

  public get [Symbol.toStringTag](): string {
    return this.wrappedPromise[Symbol.toStringTag];
  }

}


type ResolveCallback<T, R> = (value: T) => R | PromiseLike<R>;
type RejectCallback<S> = (reason: any) => S | PromiseLike<S>;
type FinallyCallback = () => void;